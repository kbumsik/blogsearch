interface Config {
  dbPath: string;
  wasmPath: string;
}

interface Result {
  columns: string[];
  values: string[][]; // [row][columns]
}

export default class SQLite {
  private config: Config;
  private sqlWorker: Worker;

  public constructor(config: Config) {
    this.config = config;
    this.sqlWorker = new Worker('worker.sql-wasm.js');
  }

  public async load(): Promise<SQLite> {
    const dbFile = await fetch(this.config.dbPath).then(r => r.arrayBuffer());
    return new Promise((resolve, _reject) => {
      this.sqlWorker.addEventListener(
        'message',
        () => {
          // eslint-disable-next-line no-console
          console.log('db loaded!');
          // Execute "SELECT `name`, `sql`  FROM `sqlite_master`  WHERE type='table';"?
          resolve(this);
        },
        { once: true }
      );
      this.sqlWorker.postMessage({ action: 'open', buffer: dbFile }, [dbFile]);
    });
  }

  public async search(match: string, top: number = 5): Promise<Result> {
    const query = `SELECT * FROM blogsearch WHERE blogsearch MATCH '${match}' ORDER BY bm25(blogsearch) LIMIT ${top};`;
    return (await this.run(query))[0];
  }

  public run(query: string): Promise<Result[]> {
    return new Promise(resolve => {
      this.sqlWorker.addEventListener(
        'message',
        e => {
          const results: Result[] = e.data.results;
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
        action: 'exec',
        sql: query,
      });
    });
  }
}

// eslint-disable-next-line no-undef
export { Config };
