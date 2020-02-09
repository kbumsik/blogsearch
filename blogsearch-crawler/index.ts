import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
// This is an "promisified" version of sqlite3
import * as sqlite from 'sqlite';
// This is only need for constants declarations
import {OPEN_READONLY, OPEN_CREATE, OPEN_READWRITE} from 'sqlite3';

export type Field = 'title' | 'categories' | 'body' | 'url';
export interface FieldsConfig {
  searchable: boolean;
  noContent: false;
  weight?: number;
}

type SelectorString = string;
type GenericParser<T> = (entry: string, page: puppeteer.Page) => Promise<puppeteer.ElementHandle<T>> | T | null;
type ParserConfig = SelectorString | GenericParser<string>;
function isSelectorString (x: ParserConfig): x is SelectorString {
  return typeof x === 'string';
}

type InputType = 'generic';

interface InputConfig {
  type: InputType;
  entries: string[];
  fieldsParser: Record<Field, ParserConfig>;
}

interface Config {
  output: string;
  inputs: InputConfig[];
  fields: Record<Field, FieldsConfig>;
}

function resolveEntry (entry: string): string {
  if (entry.startsWith('http://') || entry.startsWith('https://')
      || entry.startsWith('file://')) {
    return entry;
  } else if (fs.existsSync(entry)) {
    return `file://${path.resolve(entry)}`;
  } else {
    throw new Error(`failed to resolve the entry: ${entry}`);
  }
}

export default async function (config: Config) {
  const keys = Object.keys(config.fields);
  const browser = await puppeteer.launch({ ignoreHTTPSErrors: true });
  const db = await sqlite.open(config.output, { mode: (OPEN_CREATE | OPEN_READWRITE), verbose: true });

  await db.run(`CREATE VIRTUAL TABLE blogsearch USING fts5(${keys.join(',')}, detail=full);`);

  for (const input of config.inputs) {
    await Promise.all((new Array(4)).fill(crawlerTask(input)));
  }

  await db.close();
  await browser.close();
  return;

  async function crawlerTask (input: InputConfig) {
    const context = await browser.createIncognitoBrowserContext();

    while (input.entries.length !== 0) {
      const originalEntry = input.entries.pop() as string;
      const entry = resolveEntry(originalEntry);

      const page = await context.newPage();
      await page.goto(entry);

      const parsedFields: any = {};
      for (let [entry, parser] of Object.entries(input.fieldsParser)) {
        if (isSelectorString(parser)) {
          parser = ((selector: SelectorString): GenericParser<string> => {
            return (_, page) => page.$eval(selector, el => el.textContent);
          })(parser);
        }

        try {
          const parsed = await parser(originalEntry, page);
          if (parsed === null) {
            throw new Error('Parsing result is null.');
          }
          parsedFields[entry] = parsed.toString();
        } catch (error) {
          const msg = error instanceof Error ? error.message : error;
          throw new Error(`Failed to parse '${entry}' field in ${originalEntry}: ${msg}`);
        }
      }

      // A single quote should be encoded to two single quotes
      // See: https://www.sqlite.org/lang_expr.html
      const parameters = keys
        .map((key) => `'${ parsedFields[key].replace(/'/g, "''")}'`)
        .join(',');
      await db.run(`INSERT INTO blogsearch VALUES (${parameters});`);
      await page.close();
    }
    await context.close();
    return;
  }
}

export { Fields, InputConfig, Config };
