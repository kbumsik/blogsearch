import { Config } from './configTypes';

export const defaultFields: Config['fields'] = new Map([
  ['title', { hasContent: true, indexed: true, parser: false, enabled: true }],
  ['body', { hasContent: true, indexed: true, parser: false, enabled: true }],
  ['url', { hasContent: true, indexed: false, parser: false, enabled: true }],
  ['categories', { hasContent: true, indexed: true, parser: false, enabled: true }],
  ['tags', { hasContent: true, indexed: true, parser: false, enabled: true }],
]);
