#!/usr/bin/env node
import * as path from 'path';
import * as glob from 'glob';
import * as fs from 'fs';
import crawl, { Fields, InputConfig, Config, Field, FieldsConfig } from '../index';

const defaultFields = new Map<Field, FieldsConfig>([
  ['title', { searchable: true, noContent: false, weight: 10.0 }],
  ['url', { searchable: false, noContent: false }],
  ['body', { searchable: true, noContent: false, weight: 1.0 }],
  ['categories', { searchable: true, noContent: false, weight: 5.0 }],
]);

// Load configuration
(async function main () {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config: Config = require(path.resolve(process.cwd(), 'blogsearch.config.js'));
  if (!isConfig(config)) {
    throw new Error('module.exports is not a proper object.');
  }

  config.inputs = config.inputs.map((input: InputConfig): InputConfig => {
    return {
      // [TODO] Remove type
      ...input,
      fieldsParser: (() => {
        if (!haveSameKeys(input.fieldsParser, config.fields)) {
          throw new Error('Property names of module.exports.fields and module.exports.inputs.selectors have to match.');
        }
        return input.fieldsParser;
      })(),
      // Resolve all entries
      entries: input.entries.flatMap(entry => glob.sync(entry, { nodir: true })),
    };
  });

  // Override DB file
  if (fs.existsSync(config.output)) {
    fs.unlinkSync(config.output);
  }

  await crawl(config);
})()
  .then(_value => {
    console.log('Parsing complete.');
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  }).catch(error => {
    const msg = error instanceof Error ? error.message : error;
    console.error(`Error! ${msg}`);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });

function isConfig (config: Config | any): config is Config {
  if (typeof config !== 'object') {
    return false;
  }
  // TODO: more!
  return true;
}

function haveSameKeys (...objects: any[]) {
  const allKeys = objects.reduce((keys: string[], object) => keys.concat(Object.keys(object)), []);
  const union = new Set(allKeys);
  return objects.every(object => union.size === Object.keys(object).length);
}
