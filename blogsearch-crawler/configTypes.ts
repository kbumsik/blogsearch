import type puppeteer from 'puppeteer';
export type Field = 'title' | 'body' | 'url' | 'categories' | 'tags';
export interface FieldConfig {
  hasContent?: boolean;
  weight?: number;
  parser: Parser;
  enabled: boolean;
}

type FieldsRecord = Record<Field, FieldConfig>
export type FieldsMap = Map<Field, Required<FieldConfig>>
export type ParsedFields = Record<Field, string>;
export type ParsedFieldsMap = Map<Field, { config: Required<FieldConfig>; value: string }>;

type SelectorString = string;
export type GenericParser<T> = (entry: string, page: puppeteer.Page) => Promise<puppeteer.ElementHandle<T>> | Promise<T> | T | null;
export type Parser = SelectorString | GenericParser<string> | false;
export function isSelectorString (x: Parser): x is SelectorString {
  return typeof x === 'string';
}

export interface UncheckedConfig {
  type?: 'simple';
  output?: string;
  entries?: string[];
  fields?: FieldsMap | FieldsRecord;
}
export interface Config extends Required<UncheckedConfig> {
  fields: FieldsMap;
}
