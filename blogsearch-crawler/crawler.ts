import puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import {
  Config, Parser, GenericParser, isSelectorString, ParsedFieldsMap
} from './configTypes';
import { Database } from './database';

export default async function (config: Config) {
  config.fields = filterMap(config.fields, field => field.enabled);

  /**
   * I disable sandbox because our docker image facing "No usable sandbox!"
   * issue.I think it is okay because blogsearch-crawler crawls trusted websites
   * (aka. your static websites.)
   */
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const db = await Database.create({
    filename: config.output,
    columns: config.fields
  });
  let rowid = 0;

  const numCores = os.cpus().length;
  console.log(`${config.entries.length} entries found.`);
  console.log(`${numCores} cores detected. Running ${numCores} workers.`);
  await Promise.all([...Array(numCores).keys()]
    .map(taskNumber => crawlerWorker(config, taskNumber)));

  await browser.close();
  await db.close();
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

      const parsedFields: ParsedFieldsMap = new Map();
      for (const [field, fieldConfig] of fields) {
        const parser = checkParser(fieldConfig.parser);

        try {
          const parsed = await parser(entry, page);
          if (parsed === null) {
            throw new Error('Parsing result is null.');
          }
          parsedFields.set(field, { config: fieldConfig, value: parsed.toString() });
        } catch (error) {
          const msg = error instanceof Error ? error.message : error;
          throw new Error(`Failed to parse '${field}' field in ${entry}: ${msg}`);
        }
      }

      await db.insert(rowid++, parsedFields);
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
