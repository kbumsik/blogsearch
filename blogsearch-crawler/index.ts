import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as process from 'process';
// This is an "promisified" version of sqlite3
import * as sqlite from 'sqlite';
// This is only need for constants declarations
import {OPEN_READONLY, OPEN_CREATE, OPEN_READWRITE} from 'sqlite3';

type inputFields = object;

interface IInput {
  type: string;
  includes: string[];
  selectors: inputFields;
}

interface IConfig {
  output: string;
  inputs: IInput[];
  fields: inputFields;
  contentless: boolean;
}

export default async function(config: IConfig) {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
  });
  const db = await sqlite.open(config.output,
    { mode: (OPEN_CREATE | OPEN_READWRITE), verbose: true });
  const keys = Object.keys(config.fields);
  let stmt = await db.run(`CREATE VIRTUAL TABLE blogsearch USING fts5(${keys.join(',')}, detail=full);`);

  // The crawler task
  const crawlerTask = async (input: IInput) => {
    const context = await browser.createIncognitoBrowserContext();
    for (let include; include = input.includes.pop();) {
      const page = await context.newPage();
      console.log(include);
      await page.goto(include);
      // TODO: what if include is a directory?

      const parsedFields: any = {};
      for (const [key, selector] of Object.entries(input.selectors)) {
        try {
          const parsed = await page.$eval(selector, el => el.textContent);
          parsedFields[key] = parsed?.toString();
        } catch (err) {
          throw new Error (`Parsing failed: ${key} field in ${include}. :${err}`);
        }
      }

      // A single quote should be encoded to two single quotes: https://www.sqlite.org/lang_expr.html
      const parameters = keys.map((key) =>
          `'${ parsedFields[key].replace(/'/g, "''") }'`
        ).join(',');
      stmt = await db.run(`INSERT INTO blogsearch VALUES (${parameters});`);
      page.close();
    }
    await context.close();
    return;
  };

  // Start crawler and finish
  for (const input of config.inputs) {
    // TODO: configurable number of tasks
    await Promise.all((new Array(4)).fill(crawlerTask(input)));
  }
  db.close();
  browser.close();
}

export { inputFields, IInput, IConfig };
