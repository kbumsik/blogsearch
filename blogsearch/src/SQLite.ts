import type { Config, WorkerMessage } from './sqlite/worker';
import type { QueryResult, SQLResultColumns } from './sqlite/api';

declare global {
  interface Worker {
    addEventListener(
      type: 'message',
      handler: (e: { data: WorkerMessage.Response }) => any,
      option: { once: true }
    ): void;
    postMessage(message: WorkerMessage.Command, transfer?: Transferable[]): void;
  }
}

export type SearchResult = {
  [field in keyof SQLResultColumns]: string;
};

export default class SQLite {
  private dbPath: string;
  private wasmPath?: string;
  private sqlWorker: Worker;

  public constructor({ dbPath, wasmPath, worker }: Config & { worker: Worker }) {
    this.dbPath = dbPath;
    this.wasmPath = wasmPath;
    this.sqlWorker = worker;
    this.sqlWorker.onerror = (error) => {
      const message = (() => {
        if (error instanceof ErrorEvent) {
          return [
            `FileName: ${  error.filename}`,
            `LineNumber: ${  error.lineno}`,
            `Message: ${  error.message}`
          ].join(' - ');
        } else {
          return error;
        }
      })();
      console.error(message);
    }
  }

  public load(): Promise<SQLite> {
    return new Promise((resolve, reject) => {
      this.sqlWorker.addEventListener(
        'message',
        (e) => {
          if (e.data.respondTo !== 'open') {
            reject(Error('Internal Error: response is not open'));
            return;
          } else if (!e.data.success) {
            reject(Error('Internal Error: open failed'));
            return;
          }
          // eslint-disable-next-line no-console
          console.log('db loaded!');
          // Execute "SELECT `name`, `sql`  FROM `sqlite_master`  WHERE type='table';"?
          resolve(this);
        },
        { once: true }
      );
      console.log('posting message...');
      this.sqlWorker.postMessage({ command: 'open', dbPath: this.dbPath, wasmPath: this.wasmPath });
    });
  }

  public async search(match: string, top: number): Promise<SearchResult[]> {
    const query = `
      SELECT *
      FROM blogsearch
      WHERE blogsearch 
        MATCH '${match}'
      ORDER BY bm25(blogsearch)
      LIMIT ${top};
    `;
    const raw = await this.run(query);
    if (raw.length === 0) {
      return [];
    }
    const { columns, values } = raw[0];
    return values.map(rowValues => {
      return Object.fromEntries(zip(columns, rowValues));
    });
  }

  public run(query: string): Promise<QueryResult[]> {
    return new Promise((resolve, reject) => {
      this.sqlWorker.addEventListener(
        'message',
        e => {
          if (e.data.respondTo !== 'exec') {
            reject(Error('Internal Error: response is not exec'));
            return;
          }
          const { results } = e.data;
          // eslint-disable-next-line no-console
          console.log(results);
          for (let i = 0; i < results.length; i++) {
            const record = results[i];
            // eslint-disable-next-line no-console
            console.log(record.columns);
            // eslint-disable-next-line no-console
            console.log(record.values);
          }
          resolve(results);
        },
        { once: true }
      );
      this.sqlWorker.postMessage({
        command: 'exec',
        sql: query,
      });
    });
  }
}

/**
 * The same as python's built-in zip function.
 * @param arrays arrays of arrays of the same size.
 */
function* zip(...arrays: any[]) {
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

export { Config };
