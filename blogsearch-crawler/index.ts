import * as glob from 'glob';
import * as fs from 'fs';
import { Config, UncheckedConfig, FieldConfig } from './configTypes';
import crawl from './crawler';
import { defaultFields } from './defaultFields';

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

    // Override defaults if not set.
    for (const [fieldToCheck, defaultField] of defaultFields) {
      if (!(fieldToCheck in fields)) {
        throw new Error(`'${fieldToCheck}' is missing in 'fields'.`);
      }
      newFields.set(fieldToCheck, { ...defaultField, ...fields[fieldToCheck] });

      // extra field check
      const newFieldObj = newFields.get(fieldToCheck) as FieldConfig;
      const defaultFieldObj = defaultFields.get(fieldToCheck) as FieldConfig;
      if (Object.keys(newFieldObj).length !== Object.keys(defaultFieldObj).length) {
        for (const prop in defaultFieldObj) {
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete newFieldObj[prop];
        }
        throw new Error(`'${fieldToCheck}' field has unsupported configs: ${Object.keys(newFieldObj)}.`);
      }
    }

    return newFields;
  } else {
    throw new Error('\'fields\' must be an object with proper search configurations.');
  }
}
