import puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
// This is an "promisified" version of sqlite3
import * as sqlite from 'sqlite';
// This is only need for constants declarations
import { OPEN_CREATE, OPEN_READWRITE } from 'sqlite3';

export type Field = 'title' | 'categories' | 'body' | 'url';
export interface FieldConfig {
  searchable?: boolean;
  noContent?: false;
  weight?: number;
}

type SelectorString = string;
type GenericParser<T> = (entry: string, page: puppeteer.Page) => Promise<puppeteer.ElementHandle<T>> | T | null;
export type ParserConfig = SelectorString | GenericParser<string> | false;
function isSelectorString (x: ParserConfig): x is SelectorString {
  return typeof x === 'string';
}

export interface UncheckedInputConfig {
  entries?: string[];
  fieldsParser?: Map<Field, ParserConfig> | Record<Field, ParserConfig>;
}
export interface InputConfig extends Required<UncheckedInputConfig> {
  fieldsParser: Map<Field, ParserConfig>;
}

export interface UncheckedConfig {
  output?: string;
  inputs?: UncheckedInputConfig[];
  fields?: Map<Field, FieldConfig> | Record<Field, FieldConfig>;
}
export interface Config extends Required<UncheckedConfig> {
  inputs: InputConfig[];
  fields: Map<Field, Required<FieldConfig>>;
}

export default async function (config: Config) {
  const browser = await puppeteer.launch({ ignoreHTTPSErrors: true });
  const db = await sqlite.open(config.output, { mode: (OPEN_CREATE | OPEN_READWRITE), verbose: true });

  await db.run(`CREATE VIRTUAL TABLE blogsearch USING fts5(${Array.from(config.fields.keys()).join(',')}, detail=full);`);

  for (const input of config.inputs) {
    await Promise.all((new Array(4)).fill(crawlerTask(input)));
  }

  await db.close();
  await browser.close();
  return;

  async function crawlerTask (input: InputConfig) {
    const context = await browser.createIncognitoBrowserContext();

    // Use Array.pop() for iteration because multiple async crawl tasks consumes the same array
    while (input.entries.length !== 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const entry = input.entries.pop()!;

      const page = await context.newPage();
      await page.goto(resolveEntry(entry));

      const parsedFields = new Map<Field, string>();
      for (let [field, parser] of input.fieldsParser) {
        if (isSelectorString(parser)) {
          const selector = parser;
          parser = (_, page) => page.$eval(selector, el => el.textContent);
        } else if (!parser) {
          parser = () => '';
        }

        try {
          const parsed = await parser(entry, page);
          if (parsed === null) {
            throw new Error('Parsing result is null.');
          }
          parsedFields.set(field, parsed.toString());
        } catch (error) {
          const msg = error instanceof Error ? error.message : error;
          throw new Error(`Failed to parse '${field}' field in ${entry}: ${msg}`);
        }
      }

      // A single quote should be encoded to two single quotes
      // See: https://www.sqlite.org/lang_expr.html
      const values =
        Array.from(parsedFields.values())
          .map(value => value.replace(/'/g, "''"))
          .map(value => `'${value}'`)
          .join(',');
      console.log(values);
      await db.run(`INSERT INTO blogsearch VALUES (${values});`);
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
    throw new Error(`failed to resolve the entry: ${entry}`);
  }
}
