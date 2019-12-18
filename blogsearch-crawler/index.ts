import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as process from 'process';

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

  const crawl = async (input: IInput) => {
    const context = await browser.createIncognitoBrowserContext();
    for (let include; include = input.includes.pop();) {
      const page = await context.newPage();
      console.log(include);
      await page.goto(include);
      // TODO: what if include is a directory?

      for (const [key, selector] of Object.entries(input.selectors)) {
        try {
          const parsed = await page.$eval(selector, el => el.textContent);
          console.log(parsed);
        } catch (err) {
          throw new Error (`Parsing failed: ${key} field in ${include}. :${err}`);
        }
      }
      page.close();
    }
    await context.close();
    return;
  };

  for (const input of config.inputs) {
    // TODO: configurable number of crawlers
    await Promise.all((new Array(4)).fill(crawl(input)));
  }

  browser.close();
}

export { inputFields, IInput, IConfig };
