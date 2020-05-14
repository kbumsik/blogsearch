import SQLite from 'sqlite-wasm/lib/WorkerWrapper';
import { Suggestion } from './autocomplete.js';

export interface Config {
  dbPath: string;
  wasmPath: string;
  worker: Worker;
}

enum Db {
  TitleIdx = 0,

  BobyIdx,
  UrlIdx,
  CategoriesIdx,
  TagsIdx,
  DbName = 'blogsearch',
  MaxDisplayedTokens = 10,
};

export default class SearchEngine {

  private constructor (
    private readonly sqlite: SQLite,
  ) {}

  public static async create ({
    dbPath,
    wasmPath,
    worker
  }: Config)
  : Promise<SearchEngine> {
    /**
     * The size of the worker is big (~200kb or ~50kb compressed) so it takes
     * some time to instantiate. Therefore fetch binaraies before the worker
     * is available. It is especially important for wasmBuffer because this
     * means that we give up using streaming compilation in the worker side 
     * (aka. WebAssembly.instantiateStreaming()) because fetching it parallelly
     * is faster than worker initialization and wasm streaming serially.
     */
    const wasmBuffer = fetch(wasmPath).then(r => r.arrayBuffer());
    const dbBuffer = fetch(dbPath).then(r => r.arrayBuffer());

    const sqlite = await SQLite.init({
      wasmBinary: await wasmBuffer,
      worker,
    });
    await sqlite.open({
      dbBinary: await dbBuffer
    });
    return new SearchEngine(sqlite);
  }

  public async search (
    match: string,
    top: number = 5,
    highlightPreTag: string = '<span class="blogsearch-suggestion--highlight">',
    highlightPostTag: string = '</span>',
  ): Promise<Suggestion[]> {
    // Source: https://www.sqlite.org/fts5.html#the_snippet_function
    const query = `
      SELECT
        *,
        snippet(${Db.DbName}, ${Db.BobyIdx}, '{{%%%', '%%%}}', '', ${Db.MaxDisplayedTokens}) as body_highlight
      FROM ${Db.DbName}
      WHERE ${Db.DbName} 
        MATCH '${match}'
      ORDER BY bm25(${Db.DbName})
      LIMIT ${top};
    `;
    const raw = await this.sqlite.run({ query });
    if (raw.length === 0) {
      return [];
    }
    // Only one row because only one SQL query is executed.
    const { columns, values } = raw[0];

    return values
      .filter(row => row[Db.TitleIdx]) // Filter empty titles
      .map(row => {
        const hightlightIdx = row.length - 1;
        // hightlight body string
        // eslint-disable-next-line no-param-reassign
        row[hightlightIdx] = escapeXMLCharacters(row[hightlightIdx] as string)
          .replace(/{{%%%/g, highlightPreTag)
          .replace(/%%%}}/g, highlightPostTag);
        return Object.fromEntries(zip(columns, row)) as Suggestion;
      })
      .map(row => ({
        ...row,
        tags: (row.tags as string ?? '')
          .split(',')
          .map(str => ({ value: str.trim() })),
        categories: (row.categories as string ?? '')
          .split(',')
          .map(str => ({ value: str.trim() })),
      }));
  }
  
  public close () {
    this.sqlite.terminate();
  }
}

/**
 * The same as python's built-in zip function.
 *
 * @param arrays arrays of arrays of the same size.
 */
function * zip (...arrays: any[]) {
  const numOfArrays = arrays.length;
  const arrayLength = arrays[0].length;
  for (let i = 0; i < arrayLength; i++) {
    const row = [];
    for (let j = 0; j < numOfArrays; j++) {
      row.push(arrays[j][i]);
    }
    yield row;
  }
}

/**
 * Escape XML tag characters, from the W3C recommendation.
 * https://www.w3.org/International/questions/qa-escapes#use
 *
 * @param input unsafe string
 */
function escapeXMLCharacters (input: string) {
  return input.replace(/[<>&]/g, c => {
    switch (c) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      default:  throw new Error('Error: XML escape Error.');
    }
  });
}
