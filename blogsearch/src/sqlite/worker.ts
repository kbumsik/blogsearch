// [WARNING] The top-level imports must be type imports only.
//   Importing actual motule will hoist outside of initWorker() function,
//   making it difficult to wrap around it for UMD Web Worker function.
import type { SQLite3Module } from './sqlite3-emscripten';
import type { SQLResultColumns, Database } from './sqlite3';
import type { WorkerMessage } from './worker-interface';

declare global {
  /**
   * Override postMessage to narrow its usage
   * from (message: any) to (message: WorkerMessage.Response).
   */
  // eslint-disable-next-line no-implicit-globals, no-redeclare
  function postMessage(message: WorkerMessage.Response, transfer?: Transferable[]): void;
}

export default async function initWorker() {
  const sqlite3Module = (await import('./sqlite3-emscripten')).default;
  const sqlit3API = await import('./sqlite3');
  const loadWasm = wasmLoader(sqlite3Module as EmscriptenModule);
  /** @type {Database} I import Database dynamically as value so I cannot use typeof Database. */
  let db: Database;

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
        db = new sqlit3API.Database(sqliteModule, new Uint8Array(await dbBuffer));
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
