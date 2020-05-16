import SQLite from 'sqlite-wasm/lib/WorkerWrapper';
import { Suggestion } from './autocomplete.js';

const DbName = 'blogsearch';
const MaxDisplayedTokens = 10;
enum Column {
  Title = 'title',

  Body = 'body',
  Url = 'url',
  Categories = 'categories',
  Tags = 'tags',
};

export interface Config {
  dbPath: string;
  wasmPath: string;
  worker: Worker;
  weights?: Record<Column, number>
}

export default class SearchEngine {
  private constructor (
    private readonly sqlite: SQLite,
    private readonly weightMap: Map<Column, number>,
    private readonly indexes: Partial<Record<Column, number>> = {},
  ) {
    let index = 0;
    for (const [column] of this.weightMap) {
      this.indexes[column] = index++;
    }
  }

  public static async create ({
    dbPath,
    wasmPath,
    worker,
    weights = {
      title: 5,
      body: 1,
      url: 1, // URL is usually UNINDEXED, therefore this value usually ignored.
      categories: 3,
      tags: 3,
    }
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

    const sqlite = await SQLite.init({ wasmBinary: await wasmBuffer, worker });
    await sqlite.open({ dbBinary: await dbBuffer });

    // Retrive column info of 'blogsearch' table to get fields and its weights
    const meta = (await sqlite.run({
      query: "SELECT `name`, `sql` FROM `sqlite_master` WHERE type='table';"
    }))[0].values
      // Columns: ['name'(table name), 'sql'(SQL that created the table)]
      .find(row => row[0] === DbName);
    if (typeof meta === 'undefined') throw new Error("Failed to retrive columns information of 'blogsearch'.");
    // Extract columns from a sql SELECT statement.
    // Example statement: CREATE VIRTUAL TABLE blogsearch USING fts5( title,body,url UNINDEXED, tokenize = 'porter unicode61 remove_diacritics 1', content=blogsearch_ext_content, content_rowid=rowid)
    const columns: Column[]= meta[1]?.toString()
      .replace(/UNINDEXED/g, '') // Remove UNINDEXED column option. The column's weights are ignored anyway.
      .replace(/[\n|\s]+/g, ' ') // Remove newline
      .match(/fts5\((.+)\)/)![1]
      .split(',')
      .filter(column => !column.includes('=')) // column containing '=' are fts5 option specifiers
      .map(column => column.trim() as Column);
    const weightMap = new Map();
    for (const column of columns) {
      weightMap.set(column, weights[column] ?? 1);
    }
    return new SearchEngine(sqlite, weightMap);
  }

  public async search (
    match: string,
    top: number = 5,
    highlightPreTag: string = '<span class="blogsearch-suggestion--highlight">',
    highlightPostTag: string = '</span>',
  ): Promise<Suggestion[]> {
    const bodyExists = this.weightMap.get(Column.Body) ? true : false;
    // Source: https://www.sqlite.org/fts5.html#the_snippet_function
    const query = `
      SELECT
        *
        ${bodyExists ? `, snippet(${DbName}, ${this.indexes[Column.Body]}, '{{%%%', '%%%}}', '', ${MaxDisplayedTokens}) as body_highlight` : ''}
      FROM ${DbName}
      WHERE ${DbName} 
        MATCH '${match}'
      ORDER BY bm25(${DbName}, ${[...this.weightMap.values()].join(',')})
      LIMIT ${top};
    `;

    const raw = (await this.sqlite.run({ query }))[0];
    if (typeof raw === 'undefined') return [];
    const { columns, values } = raw;

    return values
      .filter(row => row[this.indexes[Column.Title]!] ?? true) // Filter empty titles
      .map(row => {
        if (bodyExists) {
          const hightlightIdx = row.length - 1;
          // hightlight body string
          // eslint-disable-next-line no-param-reassign
          row[hightlightIdx] = escapeXMLCharacters(row[hightlightIdx] as string)
            .replace(/{{%%%/g, highlightPreTag)
            .replace(/%%%}}/g, highlightPostTag);
        }
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
      default:  throw new Error('XML escape Error.');
    }
  });
}
