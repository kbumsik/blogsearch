#!/usr/bin/env node
import * as path from 'path';
import * as glob from 'glob';
import * as fs from 'fs';
import crawl, { Fields, InputConfig, Config } from '../index';

// to use V8's code cache to speed up instantiation time
require('v8-compile-cache');

function objectsHaveSameKeys (...objects: object[]) {
  const allKeys = objects.reduce((keys: string[], object) => keys.concat(Object.keys(object)), []);
  const union = new Set(allKeys);
  return objects.every((object) => union.size === Object.keys(object).length);
}

// Load configuration
function isConfig(config: Config | any): config is Config {
  if (typeof config !== 'object') {
    return false;
  }
  // TODO: more!
  return true;
}

(async function main() {
  const config: Config | any = require(path.resolve(process.cwd(), 'blogsearch.config.js'));
  if (!isConfig(config)) {
    throw new Error('module.exports is not a proper object.');
  }

  // Verify configs
  const inputsFields = config.inputs.map(({ fieldsParser }) => fieldsParser);
  if (!objectsHaveSameKeys(config.fields, ...inputsFields)) {
    throw new Error('Property names of module.exports.fields and ' +
                    'module.exports.inputs.selectors have to match.');
  }

  // Correct path of includes
  config.inputs.map((input: InputConfig): InputConfig => {
    // Resolve all glob entries
    input.entries = input.entries.reduce((entries: string[], entryOrGlob) => {
      const resolved = glob.sync(entryOrGlob, { nodir: true });
      entries.push(...resolved);
      return entries;
    }, []);
    return input;
  });

  // Override DB file
  if (fs.existsSync(config.output)) {
    fs.unlinkSync(config.output);
  }

  await crawl(config);
})().catch((error) => {
  const msg = error instanceof Error ? error.message : error;
  console.error(`Error! ${msg}`);
  process.exit(1);
}).then((value) => {
  console.log('Parsing complete.');
  process.exit(0);
});
