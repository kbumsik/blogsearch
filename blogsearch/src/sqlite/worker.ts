import type {
  QueryResult,
  SQLResultColumns,
  SQLParameterArray,
  SQLParameterFields,
} from './api';
import type { SQLite3Module } from './sqlite3-emscripten';

export interface Config {
  dbPath: string;
  wasmPath?: string;
}

export interface Query {
  sql: string;
  params?: SQLParameterArray | SQLParameterFields;
}

export namespace WorkerMessage {
  export type Command =
    | OpenCommand
    | ExecCommand
    | EachCommand
    | ExportCommand
    | CloseCommand;
  export type Response =
    | OpenResponse
    | ExecResponse
    | EachResponse
    | ExportResponse
    | CloseResponse;

  interface OpenCommand extends Config {
    command: 'open';
  }
  interface OpenResponse {
    respondTo: OpenCommand['command'];
    success: boolean;
  }

  interface ExecCommand extends Query {
    command: 'exec';
  }
  interface ExecResponse {
    respondTo: ExecCommand['command'];
    results: QueryResult[];
  }

  interface EachCommand extends Required<Query> {
    command: 'each';
  }
  interface EachResponse {
    respondTo: EachCommand['command'];
    row: SQLResultColumns;
    end: boolean;
  }

  interface ExportCommand {
    command: 'export';
  }
  interface ExportResponse {
    respondTo: ExportCommand['command'];
    buffer: ArrayBuffer;
  }

  interface CloseCommand {
    command: 'close';
  }
  interface CloseResponse {
    respondTo: CloseCommand['command'];
    success: boolean;
  }
}

/**
 * Override postMessage to narrow its usage
 * from (message: any) to (message: WorkerMessage.Response).
 */
declare function postMessage(message: WorkerMessage.Response, transfer?: Transferable[]): void;

export default async function initWorker() {
  const sqlite3 = (await import('./sqlite3-emscripten')).default;
  const { Database } = await import('./api');
  const loadWasm = wasmLoader(sqlite3 as EmscriptenModule);
  /** @type {Database} I import Database dynamically as value so I cannot use typeof Database. */
  let db: any;

  onmessage = async function(e: { data: WorkerMessage.Command }) {
    console.log(e);
    const { data } = e;
    switch (data.command) {
      case 'open': {
        if (db) {
          db.close();
        }
        const dbBuffer = fetch(data.dbPath).then(r => r.arrayBuffer());
        // sqlite = (await loadWasm(data.wasmPath)) as EmscriptenModule;
        const sqliteModule = (await loadWasm(data.wasmPath)) as SQLite3Module;
        db = new Database(sqliteModule, new Uint8Array(await dbBuffer));
        postMessage({ respondTo: 'open', success: true });
        break;
      }
      case 'exec': {
        if (!db) {
          throw new Error('exec: DB is not initialized.');
        }
        if (!data.sql) {
          throw new Error('exec: Missing query string');
        }
        postMessage({
          respondTo: 'exec',
          results: db.exec(data.sql),
        });
        break;
      }
      case 'each': {
        if (!db) {
          throw new Error('exec: DB is not initialized.');
        }
        if (!data.sql) {
          throw new Error('exec: Missing query string');
        }
        db.each(
          data.sql,
          data.params,
          (row: SQLResultColumns) => postMessage({ respondTo: 'each', row, end: false }),
          () => postMessage({ respondTo: 'each', row: {}, end: true })
        );
        break;
      }
      case 'export': {
        if (!db) {
          throw new Error('exec: DB is not initialized.');
        }
        const buffer = db.export();
        postMessage({ respondTo: 'export', buffer }, [buffer]);
        break;
      }
      case 'close': {
        if (!db) {
          throw new Error('close: DB is not opened yet.');
        }
        db.close();
        postMessage({ respondTo: 'close', success: true });
        break;
      }
      default: {
        throw new Error(`Invalid command: ${data}`);
      }
    }
  };
}

function wasmLoader(module: EmscriptenModule) {
  let loadedModule: EmscriptenModule | null = null;
  return function(wasmPath?: string): Promise<Omit<EmscriptenModule, 'then'>> {
    return new Promise((resolve, reject) => {
      if (loadedModule) {
        resolve(loadedModule);
      }
      // Override Emscripten configuration
      const moduleOverrides: any = {};
      moduleOverrides['onAbort'] = function(what: any) {
        reject(what);
      };
      if (typeof wasmPath !== 'undefined' && wasmPath) {
        moduleOverrides['locateFile'] = function (path: string, scriptDirectory: string) {
          console.log('fetching ', path);
          return path.match(/.wasm/) ? wasmPath : (scriptDirectory + path);
        };
      }

      try {
        // [NOTE] Emscripten's then() is NOT really promise-based 'thenable'.
        //        then() must be deleted otherwise it casues infinite loop.
        module(moduleOverrides).then(wasmModule => {
          // eslint-disable-next-line no-param-reassign
          delete wasmModule['then'];
          loadedModule = wasmModule;
          resolve(wasmModule);
        });
      } catch (e) {
        reject(new Error(`Loading SQLite .wasm module failed: ${e}`));
      }
    });
  };
}

/* global WorkerGlobalScope */
// Run only if it is in web worker environment
if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
  initWorker();
}

/**
 * TODO: This line causes undefined symbol: __webpack_require__
 * So comment out until figuring out the solution
 */
// module.exports = initWorker;
