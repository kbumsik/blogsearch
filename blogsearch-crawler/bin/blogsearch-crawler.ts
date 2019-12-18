#!/usr/bin/env node
import * as path from 'path';
import * as fs from 'fs';
import crawl, { inputFields, IInput, IConfig } from '../index';

// to use V8's code cache to speed up instantiation time
require('v8-compile-cache');

function objectsHaveSameKeys (...objects: object[]) {
  const allKeys = objects.reduce((keys: string[], object) => keys.concat(Object.keys(object)), []);
  const union = new Set(allKeys);
  return objects.every((object) => union.size === Object.keys(object).length);
}

// Load configuration
function isIConfig(config: IConfig | any): config is IConfig {
  if (typeof config !== 'object') {
    return false;
  }
  // TODO: more!
  return true;
}

(async function main() {
  const config: IConfig | any = require(path.resolve(process.cwd(), 'blogsearch.config.js'));
  if (!isIConfig(config)) {
    throw new Error('module.exports is not a proper object.');
  }

  // Verify configs
  const inputsFields = config.inputs.map(({ selectors }) => selectors);
  if (!objectsHaveSameKeys(config.fields, ...inputsFields)) {
    throw new Error('Property names of module.exports.fields and ' +
                    'module.exports.inputs.selectors have to match.');
  }

  // Correct path of includes
  config.inputs.map((input) => {
    input.includes = input.includes.map((include) => {
      if (include.startsWith('http://') || include.startsWith('https://')
          || include.startsWith('file://')) {
        return include;
      } else if (fs.existsSync(include)) {
        return `file://${path.resolve(include)}`;
      } else {
        throw new Error('Each entries of includes must be either a web URL' +
                        '(including https:// or http://) or a path of existing file');
      }
    });
    return input;
  });

  await crawl(config);
})().catch((reason) => {
  console.error(`Error! ${reason}`);
  process.exit(1);
}).then((value) => {
  console.log('Parsing complete.');
  process.exit(0);
});
