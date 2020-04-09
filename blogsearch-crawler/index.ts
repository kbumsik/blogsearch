import * as glob from 'glob';
import * as fs from 'fs';
import { Config, UncheckedConfig } from './configTypes';
import crawl from './crawler';

const madatoryDefaults: Config['fields'] = new Map([
  ['title', { hasContent: true, weight: 10.0, parser: false }],
  ['body', { hasContent: false, weight: 1.0, parser: false }],
  ['url', { hasContent: true, weight: 0, parser: false }],
]);

const optionalDefaults: Config['fields'] = new Map([
  ['categories', { hasContent: true, weight: 5.0, parser: false }],
  ['tags', { hasContent: true, weight: 5.0, parser: false }],
]);

// Load configuration
export default async function crawlBlog (uncheckedConfig: UncheckedConfig) {
  try {
    const config = checkConfig(uncheckedConfig);

    // Override DB file
    if (fs.existsSync(config.output)) {
      fs.unlinkSync(config.output);
    }

    await crawl(config);
  } catch (error) {
    // [TODO] Add doc
    throw new Error(`${error}`);
  }
}

function checkConfig (config: UncheckedConfig): Config {
  if (typeof config !== 'object') {
    throw new Error('Exported config must be an object.');
  }
  return {
    type: checkType(config),
    output: checkOutput(config),
    entries: checkEntries(config),
    fields: checkFields(config)
  };
}

function checkType ({ type }: UncheckedConfig) {
  if (type === undefined) {
    throw new Error('\'type\' must be specified');
  }
  if (type === 'simple') {
    return type;
  } else {
    throw new Error('\'type\' must be \'simple\' value');
  }
}

function checkOutput ({ output }: UncheckedConfig) {
  if (output === undefined) {
    throw new Error('\'output\' must be specified');
  }
  if (typeof output !== 'string') {
    throw new Error('\'output\' must be a string of a generated database file path.');
  }
  return output;
}

function checkEntries ({ entries }: UncheckedConfig) {
  if (entries === undefined) {
    throw new Error('\'entries\' must be specified');
  }
  if (Array.isArray(entries)) {
    return entries.flatMap(entry => glob.sync(entry, { nodir: true }));
  } else {
    throw new Error('\'entries\' must be an array of glob patterns.');
  }
}

function checkFields ({ fields }: UncheckedConfig) {
  if (fields === undefined) {
    throw new Error('\'fields\' must be specified');
  }
  if (typeof fields === 'object' && !(fields instanceof Map)) {
    const newFields: Config['fields'] = new Map();

    const overrideDefaults = (defaults: Config['fields'], mandatory: boolean) => {
      for (const [fieldToCheck, defaultField] of defaults) {
        if (!(fieldToCheck in fields)) {
          if (mandatory) {
            throw new Error(`'${fieldToCheck}' is missing in 'fields'.`);
          } else {
            return;
          }
        }
        newFields.set(fieldToCheck, { ...defaultField, ...fields[fieldToCheck] });
      }
    };

    overrideDefaults(madatoryDefaults, true);
    overrideDefaults(optionalDefaults, false);
    return newFields;
  } else {
    throw new Error('\'fields\' must be an object with proper search configurations.');
  }
}
