import { WorkerMessage } from './sqlite/worker-interface';
import { QueryResult, ReturnMap } from './sqlite/sqlite3-types';

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

export type SearchResult = {
  [field in keyof ReturnMap]: string;
};

export default class SearchEngine {

  private constructor (
    private readonly sqlWorker: Worker,
  ) {
    this.sqlWorker.onerror = error => {
      const message = (() => {
        if (error instanceof ErrorEvent) {
          return [
            `FileName: ${error.filename}`,
            `LineNumber: ${error.lineno}`,
            `Message: ${error.message}`,
          ].join(' - ');
        } else {
          return error;
        }
      })();
      // eslint-disable-next-line no-console
      console.error(message);
    };
  }

  public static async create ({
    dbPath,
    wasmPath,
    worker
  }: Config)
  : Promise<SearchEngine> {
    // fetch first to reduce delay
    const dbBuffer = fetch(dbPath).then(r => r.arrayBuffer());

    const obj = new SearchEngine(worker);
    await obj.init(wasmPath);
    await obj.open(await dbBuffer);
    return obj;
  }

  private async init (wasmPath: string): Promise<SearchEngine> {
    return new Promise((resolve, reject) => {
      this.handleMessageFromWorker(response => {
        if (response.respondTo !== 'init') {
          reject(new Error('Internal Error: response is not init'));
          return;
        } else if (!response.success) {
          reject(new Error('Internal Error: init failed'));
          return;
        }
        resolve(this);
      });

      this.postMessageToWorker({
        command: 'init',
        wasmPath,
      });
    });
  }

  private async open (dbBinary: ArrayBuffer): Promise<SearchEngine> {
    return new Promise((resolve, reject) => {
      this.handleMessageFromWorker(response => {
        if (response.respondTo !== 'open') {
          reject(new Error('Internal Error: response is not open'));
          return;
        } else if (!response.success) {
          reject(new Error('Internal Error: open failed'));
          return;
        }
        resolve(this);
      });

      this.postMessageToWorker({
        command: 'open',
        dbBinary
      }, [dbBinary]);
    });
  }

  public async search (
    match: string,
    top: number
  ): Promise<SearchResult[]> {
    // Source: https://www.sqlite.org/fts5.html#the_snippet_function
    const query = `
      SELECT
        snippet(${Db.DbName}, ${Db.BobyIdx}, '{{%%%', '%%%}}', '', ${Db.MaxDisplayedTokens}) as body_highlight,
        *
      FROM ${Db.DbName}
      WHERE ${Db.DbName} 
        MATCH '${match}'
      ORDER BY bm25(${Db.DbName})
      LIMIT ${top};
    `;
    const raw = await this.run(query);
    if (raw.length === 0) {
      return [];
    }
    const { columns, values } = raw[0];

    return values
      .filter(row => row[1]) // Filter empty title. [TODO] Get the title index in a better way
      .map(row => {
        // hightlight body string
        // eslint-disable-next-line no-param-reassign
        row[0] = escapeXMLCharacters(row[0] as string)
          .replace(/{{%%%/g, '<span class="blogsearch-suggestion--highlight">')
          .replace(/%%%}}/g, '</span>');
        return Object.fromEntries(zip(columns, row));
      });
  }

  public async run (query: string): Promise<QueryResult[]> {

    return new Promise((resolve, reject) => {
      this.handleMessageFromWorker(response => {
        if (response.respondTo !== 'exec') {
          reject(new Error('Internal Error: response is not exec'));
          return;
        }
        resolve(response.results);
      });

      this.postMessageToWorker({
        command: 'exec',
        sql: query,
      });
    });
  }
  
  public close () {
    this.sqlWorker.terminate();
  }

  /**
   * Wrapper for to narrow usage of worker handler.
   *
   * @param handler Handler for worker response
   */
  private handleMessageFromWorker (
    handler: (response: WorkerMessage.Response) => any
  ) {
    this.sqlWorker.addEventListener(
      'message',
      event => handler(event.data),
      { once: true }
    );
  }

  /**
   * Wrapper for to narrow usage of worker postMessage().
   *
   * @param message Command to worker
   */
  private postMessageToWorker (
    message: WorkerMessage.Command,
    transfer: Transferable[] = []
  ) {
    this.sqlWorker.postMessage(message, transfer);
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
