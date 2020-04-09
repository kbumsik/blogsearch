import puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
// This is an "promisified" version of sqlite3
import * as sqlite from 'sqlite';
// This is only need for constants declarations
import { OPEN_CREATE, OPEN_READWRITE } from 'sqlite3';

export type Field = 'title' | 'body' | 'url' | OptionalField;
export type OptionalField = 'categories' | 'tags';
export interface FieldConfig {
  hasContent?: boolean;
  weight?: number;
  parser: Parser;
}

type FieldsRecord = Record<Field, FieldConfig>
export type FieldsMap = Map<Field, Required<FieldConfig>>

type SelectorString = string;
type GenericParser<T> = (entry: string, page: puppeteer.Page) => Promise<puppeteer.ElementHandle<T>> | Promise<T> | T | null;
export type Parser = SelectorString | GenericParser<string> | false;
function isSelectorString (x: Parser): x is SelectorString {
  return typeof x === 'string';
}

export interface UncheckedConfig {
  type?: 'simple';
  output?: string;
  entries?: string[];
  fields?: FieldsMap | FieldsRecord;
}
export interface Config extends Required<UncheckedConfig> {
  fields: FieldsMap;
}

export default async function (config: Config) {
  const browser = await puppeteer.launch({ ignoreHTTPSErrors: true });
  const db = await sqlite.open(config.output, { mode: (OPEN_CREATE | OPEN_READWRITE), verbose: true });
  await db.run(`CREATE VIRTUAL TABLE blogsearch USING fts5(${Array.from(config.fields.keys()).join(',')}, detail=full);`);

  await Promise.all((new Array(4)).fill(crawlerTask(config)));

  await db.close();
  await browser.close();
  return;

  async function crawlerTask ({ fields, entries }: Config) {
    const context = await browser.createIncognitoBrowserContext();

    // Use Array.pop() for iteration because multiple async crawler tasks consume the same array
    while (entries.length !== 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const entry = entries.pop()!;

      const page = await context.newPage();
      await page.goto(resolveEntry(entry));

      const parsedFields = new Map<Field, string>();
      for (const [field, fieldConfig] of fields) {
        const parser = checkParser(fieldConfig.parser);

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
