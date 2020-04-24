import puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
// This is an "promisified" version of sqlite3
import * as sqlite from 'sqlite';
// This is only need for constants declarations
import { OPEN_CREATE, OPEN_READWRITE } from 'sqlite3';
import {
  Config, Field, Parser, GenericParser, isSelectorString, FieldConfig,
  BLOGSEARCH, BLOGSEARCH_EXT_CONTENT
} from './configTypes';

export default async function (config: Config) {
  config.fields = filterMap(config.fields, field => field.enabled);

  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    /**
     * I disable sandbox because our docker image facing "No usable sandbox!"
     * issue.I think it is okay because blogsearch-crawler crawls trusted websites
     * (aka. your static websites.)
     */
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const db = await sqlite.open(config.output, { mode: (OPEN_CREATE | OPEN_READWRITE), verbose: true });
  /**
   * Create table 'blogsearch_ext_content'. This is an external content table
   * for FTS5. External content table is used to support "hasConent" feature
   * that helps reducing the size of the output db file.
   */
  await db.run(`
    CREATE TABLE ${BLOGSEARCH_EXT_CONTENT} (
      rowid INTEGER PRIMARY KEY,
      ${[...config.fields.keys()].join(',')});`);
  /**
   * Create a virtual table 'blogsearch'
   * We use the fts5 extension to support full-text search out of the box.
   */
  await db.run(`
    CREATE VIRTUAL TABLE ${BLOGSEARCH}
    USING fts5(
        ${[...config.fields.entries()]
            .map(([field, config]) => `${field}${config.weight < 0.0001 ? ' UNINDEXED' : ''}`)
            .join(',')},
        tokenize = 'porter unicode61 remove_diacritics 1',
        content=${BLOGSEARCH_EXT_CONTENT},
        content_rowid=rowid);`);

  let rowidCounter = 0;

  // Run multiple crawler task depending on the number of the CPU cores.
  await Promise.all([...Array(os.cpus().length).keys()]
    .map(taskNumber => crawlerWorker(config, taskNumber)));

  await db.close();
  await browser.close();
  return;

  async function crawlerWorker ({ fields, entries }: Config, workerNumber: number) {
    console.log(`Worker ${workerNumber} starting...`);
    const context = await browser.createIncognitoBrowserContext();

    // Use Array.pop() for iteration because multiple async crawler tasks consume the same array
    while (entries.length !== 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const entry = entries.pop()!;
      console.log(`Worker ${workerNumber}: ${entry}`);
      const page = await context.newPage();
      try {
        await page.goto(resolveEntry(entry), {
          waitUntil: 'networkidle2'
        });
      } catch (error) {
        throw new Error(`Failed to open a page of ${entry}: ${error}`);
      }

      const parsedFields = new Map<Field, { fieldConfig: Required<FieldConfig>; value: string}>();
      for (const [field, fieldConfig] of fields) {
        const parser = checkParser(fieldConfig.parser);

        try {
          const parsed = await parser(entry, page);
          if (parsed === null) {
            throw new Error('Parsing result is null.');
          }
          parsedFields.set(field, { fieldConfig, value: parsed.toString() });
        } catch (error) {
          const msg = error instanceof Error ? error.message : error;
          throw new Error(`Failed to parse '${field}' field in ${entry}: ${msg}`);
        }
      }

      const rowid = rowidCounter++;
      /**
       * Insert the parsed content first.
       */
      await db.run(`
        INSERT INTO ${BLOGSEARCH_EXT_CONTENT}
        VALUES (
          ${rowid},
          ${[...parsedFields.values()]
            .map(({ value, fieldConfig }) => fieldConfig.hasContent ? value : '')
            .map(value => `'${value.replace(/'/g, "''")}'`) // A single quote should be encoded to two single quotes: https://www.sqlite.org/lang_expr.html
            .join(',')});`);
      /**
       * When inserting a row in the fts table, it only indexes content but does
       * not actually store content.
       */
      await db.run(`
        INSERT INTO ${BLOGSEARCH} (
          rowid,
          ${[...parsedFields.keys()].join(',')})
        VALUES (
          ${rowid},
          ${[...parsedFields.values()]
            .map(({ value }) => value)
            .map(value => `'${value.replace(/'/g, "''")}'`) // The same as above
            .join(',')});`);

      await page.close();
    }
    await context.close();
    console.log(`Worker ${workerNumber} finished.`);
    return;
  }
}

function resolveEntry (entry: string): string {
  if (entry.startsWith('http://') || entry.startsWith('https://') ||
      entry.startsWith('file://')) {
    return entry;
  } else if (fs.existsSync(entry)) {
    return `file://${path.resolve(entry)}`;
  } else {
    throw new Error(`Failed to resolve the entry: ${entry}`);
  }
}

function checkParser (parser: Parser): GenericParser<string> {
  if (isSelectorString(parser)) {
    const selector = parser;
    return (_, page) => page.$eval(selector, el => el.textContent);
  } else if (!parser) {
    return () => '';
  } else {
    return parser;
  }
}

function filterMap<K, V> (map: Map<K, V>, callback: (value: V) => boolean) {
  const newMap = new Map();
  for (const [key, value] of map) {
    if (callback(value)) {
      newMap.set(key, value);
    }
  }
  return newMap;
}
