import * as glob from 'glob';
import * as fs from 'fs';
import crawl, { UncheckedConfig, InputConfig, Config } from './crawler';

const defaultFields: Config['fields'] = new Map([
  ['title', { searchable: true, noContent: false, weight: 10.0 }],
  ['url', { searchable: false, noContent: false, weight: 1.0 }],
  ['body', { searchable: true, noContent: false, weight: 1.0 }],
  ['categories', { searchable: true, noContent: false, weight: 5.0 }],
]);

// Load configuration
export default async function crawlBlog (config: Config | UncheckedConfig) {
  try {
    if (!preprocessConfig(config)) {
      throw new Error('Parsing config file failed.');
    }

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

function preprocessConfig (config: Config | UncheckedConfig): config is Config {
  if (typeof config !== 'object') {
    throw new Error('exported mduole must be an object.');
  }

  // config.output
  if (typeof config.output !== 'string') {
    throw new Error('\'output\' field must be a string of a generated file path.');
  }

  // config.fields
  if (typeof config.fields === 'object' && !(config.fields instanceof Map)) {
    const fieldsMap: Config['fields'] = new Map();
    for (const [field, fieldConfig] of defaultFields) {
      if (!(field in config.fields)) {
        throw new Error(`'${field}' is missing in 'fields'.`);
      }
      fieldsMap.set(field, { ...fieldConfig, ...config.fields[field] });
    }
    config.fields = fieldsMap;
  } else {
    throw new Error('\'fields\' must be an object with proper fields.');
  }

  // config.inputs
  if (Array.isArray(config.inputs)) {
    config.inputs.forEach((input, index) => {
      // input.entries
      if (Array.isArray(input.entries)) {
        input.entries = input.entries.flatMap(entry => glob.sync(entry, { nodir: true }));
      } else {
        throw new Error('\'input.entries\' must be an array of glob patterns.');
      }

      // input.fieldsParser
      if (typeof input.fieldsParser !== 'object' || input.fieldsParser instanceof Map) {
        throw new Error(`'input[${index}].fieldsParser' must be an object with proper fields.`);
      }
      const fieldsParserMap: InputConfig['fieldsParser'] = new Map();
      for (const [field] of defaultFields) {
        if (!(field in input.fieldsParser)) {
          throw new Error(`${field} is missing in 'fields' field.`);
        }
        fieldsParserMap.set(field, input.fieldsParser[field]);
      }
      input.fieldsParser = fieldsParserMap;
    });
  } else {
    throw new Error('\'fields\' field must be an object with proper properties.');
  }
  return true;
}
