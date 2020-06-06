import * as glob from 'glob';
import { Config, UncheckedConfig, FieldsMap } from './configTypes';
import { defaultFields } from './defaultFields';
export default function checkConfig (config: UncheckedConfig): Config {
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
  if (type === undefined) throw new Error('\'type\' must be specified');

  if (type === 'simple') {
    return type;
  } else {
    throw new Error('\'type\' must be \'simple\' value');
  }
}

function checkOutput ({ output }: UncheckedConfig) {
  if (output === undefined) throw new Error('\'output\' must be specified');

  if (typeof output !== 'string') {
    throw new Error('\'output\' must be a string of a generated database file path.');
  }
  return output;
}

function checkEntries ({ entries }: UncheckedConfig) {
  if (entries === undefined) throw new Error('\'entries\' must be specified');

  if (Array.isArray(entries)) {
    return entries.flatMap(entry => glob.sync(entry, { nodir: true }));
  } else {
    throw new Error('\'entries\' must be an array of glob patterns.');
  }
}

export function checkFields ({ fields }: UncheckedConfig): FieldsMap {
  if (fields === undefined) throw new Error('\'fields\' must be specified');

  if (typeof fields === 'object' && !(fields instanceof Map)) {
    const newFields: Config['fields'] = new Map();

    for (const [fieldToCheck, defaultField] of defaultFields) {
      if (!(fieldToCheck in fields)) throw new Error(`'${fieldToCheck}' is missing in 'fields'.`);

      // Override from defaults if not set.
      newFields.set(fieldToCheck, { ...defaultField, ...fields[fieldToCheck] });

      // if the new field doesn't have the same keys as default,
      // then find the unmatched key and print it.
      const newFieldObj = newFields.get(fieldToCheck)!;
      const defaultFieldObj = defaultFields.get(fieldToCheck)!;
      if (!testSameKeys(newFieldObj, defaultFieldObj)) {
        for (const prop in defaultFieldObj) {
          delete (newFieldObj as any)[prop];
        }
        throw new Error(`'${fieldToCheck}' field has unsupported configs: ${Object.keys(newFieldObj)}.`);
      }
    }
    return newFields;
  } else {
    throw new Error('\'fields\' must be an object with proper search configurations.');
  }
}

function testSameKeys (a: any, b:any) {
  var aKeys = Object.keys(a).sort();
  var bKeys = Object.keys(b).sort();
  return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}
