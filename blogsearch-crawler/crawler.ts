import puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
// This is an "promisified" version of sqlite3
import * as sqlite from 'sqlite';
// This is only need for constants declarations
import { OPEN_CREATE, OPEN_READWRITE } from 'sqlite3';
import { Config, Field, Parser, GenericParser, isSelectorString, FieldConfig } from './configTypes';

export default async function (config: Config) {
  config.fields = filterMap(config.fields, field => field.enabled);

  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true
  });

  const db = await sqlite.open(config.output, { mode: (OPEN_CREATE | OPEN_READWRITE), verbose: true });
  await db.run(`
    CREATE TABLE blogsearch_ext_content (
      rowid INTEGER PRIMARY KEY,
      ${[...config.fields.keys()].join(',')});`);
  await db.run(`
    CREATE VIRTUAL TABLE blogsearch
    USING fts5(
        ${[...config.fields.entries()]
            .map(([field, config]) => `${field}${config.weight < 0.0001 ? ' UNINDEXED' : ''}`)
            .join(',')},
        tokenize = 'porter unicode61 remove_diacritics 1',
        content=blogsearch_ext_content,
        content_rowid=rowid);`);
  // This is a global rowid counter
  let rowidCounter = 0;

  await Promise.all([...Array(os.cpus().length).keys()]
    .map(taskNumber => crawlerTask(config, taskNumber)));

  await db.close();
  await browser.close();
  return;

  async function crawlerTask ({ fields, entries }: Config, taskNumber: number) {
    const context = await browser.createIncognitoBrowserContext();

    // Use Array.pop() for iteration because multiple async crawler tasks consume the same array
    while (entries.length !== 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const entry = entries.pop()!;

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

      // A single quote should be encoded to two single quotes
      // See: https://www.sqlite.org/lang_expr.html
      const rowid = rowidCounter++;
      await db.run(`
        INSERT INTO blogsearch_ext_content
        VALUES (
          ${rowid},
          ${[...parsedFields.values()]
            .map(({ value, fieldConfig }) => fieldConfig.hasContent ? value : '')
            .map(value => value.replace(/'/g, "''"))
            .map(value => `'${value}'`)
            .join(',')});`);
      await db.run(`
        INSERT INTO blogsearch (
          rowid,
          ${[...parsedFields.keys()].join(',')})
        VALUES (
          ${rowid},
          ${[...parsedFields.values()]
            .map(({ value }) => value)
            .map(value => value.replace(/'/g, "''"))
            .map(value => `'${value}'`)
            .join(',')});`);
      await page.close();
    }
    await context.close();
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
