import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
// This is an "promisified" version of sqlite3
import * as sqlite from 'sqlite';
// This is only need for constants declarations
import {OPEN_READONLY, OPEN_CREATE, OPEN_READWRITE} from 'sqlite3';

type FieldsConfig = {
  searchable: boolean;
  noContent: false;
  weight: number;
};

type SelectorString = string;
type GenericParser<T> = (entry: string, page: puppeteer.Page) => T | Promise<T>;
type ParserConfig = SelectorString | GenericParser<string | null>;
function isSelectorString(x: ParserConfig): x is SelectorString {
  return typeof x === 'string';
}

interface Fields<T> {
  [field: string]: T;
}

type InputType = 'generic';

interface InputConfig {
  type: InputType;
  entries: string[];
  fieldsParser: Fields<ParserConfig>;
}

interface Config {
  output: string;
  inputs: InputConfig[];
  fields: Fields<FieldsConfig>;
}

function resolveEntry(entry: string): string {
  if (entry.startsWith('http://') || entry.startsWith('https://')
      || entry.startsWith('file://')) {
    return entry;
  } else if (fs.existsSync(entry)) {
    return `file://${path.resolve(entry)}`;
  } else {
    throw new Error(`failed to resolve the entry: ${entry}`);
  }
}

export default async function(config: Config) {
  const keys = Object.keys(config.fields);
  const browser = await puppeteer.launch({ ignoreHTTPSErrors: true });
  const db = await sqlite.open(config.output, { mode: (OPEN_CREATE | OPEN_READWRITE), verbose: true });

  await db.run(`CREATE VIRTUAL TABLE blogsearch USING fts5(${keys.join(',')}, detail=full);`);

  for (const input of config.inputs) {
    await Promise.all((new Array(4)).fill(crawlerTask(input)));
  }

  db.close();
  browser.close();
  return;

  async function crawlerTask(input: InputConfig) {
    const context = await browser.createIncognitoBrowserContext();

    while (input.entries.length !== 0) {
      const originalEntry = input.entries.pop() as string;
      const entry = resolveEntry(originalEntry);

      const page = await context.newPage();
      await page.goto(entry);

      const parsedFields: any = {};
      for (let [key, parserConfig] of Object.entries(input.fieldsParser)) {
        if (isSelectorString(parserConfig)) {
          parserConfig = ((selector: SelectorString): GenericParser<string | null> => {
            return (_ , page) => page.$eval(selector, (el) => el.textContent);
          })(parserConfig);
        }

        try {
          const parsed: string | null = await parserConfig(originalEntry, page);
          if (parsed === null) {
            throw new Error(`Parsing result is null.`);
          }
          parsedFields[key] = parsed.toString();
        } catch (error) {
          const msg = error instanceof Error ? error.message : error;
          throw new Error(`Failed to parse '${key}' field in ${originalEntry}: ${msg}`);
        }
      }

      // A single quote should be encoded to two single quotes
      // See: https://www.sqlite.org/lang_expr.html
      const parameters = keys.map((key) => `'${ parsedFields[key].replace(/'/g, "''") }'`)
                             .join(',');
      await db.run(`INSERT INTO blogsearch VALUES (${parameters});`);
      page.close();
    }
    await context.close();
    return;
  }
}

export { Fields, InputConfig, Config };
