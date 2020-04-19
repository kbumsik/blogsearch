// [WARNING] The top-level imports must be type imports only.
//   Importing actual motule will hoist outside of initWorker() function,
//   making it difficult to wrap around it for UMD Web Worker function.
import type { SQLite3Wasm } from './sqlite3-emscripten';
import type { Database } from './sqlite3';
import type { ReturnMap } from './sqlite3-types';
import type { WorkerMessage } from './worker-interfaces';

declare global {
  /**
   * Override postMessage to narrow its usage
   * from (message: any) to (message: WorkerMessage.Response).
   */
  // eslint-disable-next-line no-implicit-globals, no-redeclare
  function postMessage(message: WorkerMessage.Response, transfer?: Transferable[]): void;
}

export default async function initWorker () {
  const sqlite3Wasm = (await import('./sqlite3-emscripten')).default;
  const sqlit3API = await import('./sqlite3');
  const loadWasm = wasmLoader(sqlite3Wasm);
  /** @type {Database} I import Database dynamically as value so I cannot use typeof Database. */
  let db: Database;

  onmessage = async function (e: { data: WorkerMessage.Command }) {
    const { data } = e;
    switch (data.command) {
      case 'open': {
        if (db) {
          db.close();
        }
        const dbBuffer = fetch(data.dbPath).then(r => r.arrayBuffer());
        // sqlite = (await loadWasm(data.wasmPath)) as EmscriptenModule;
        const wasm = (await loadWasm(data.wasmPath)) as SQLite3Wasm;
        db = new sqlit3API.Database(wasm, new Uint8Array(await dbBuffer));
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
          (row: ReturnMap) => postMessage({ respondTo: 'each', row, end: false }),
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

/* eslint-disable dot-notation */
function wasmLoader (wasmModule: SQLite3Wasm) {
  let loadedModule: SQLite3Wasm | null = null;
  return async function (wasmPath?: string): Promise<Omit<SQLite3Wasm, 'then'>> {
    return new Promise((resolve, reject) => {
      if (loadedModule) {
        resolve(loadedModule);
      }
      // Override Emscripten configuration
      const moduleOverrides: Partial<SQLite3Wasm> = {};
      moduleOverrides['onAbort'] = function (what: any) {
        reject(what);
      };
      if (typeof wasmPath === 'string' && wasmPath) {
        // This allows loading .wasm (wasmPath from index.ts) from cross-site.
        // @ts-ignore
        moduleOverrides['locateFile'] = function (path: string, scriptDirectory: string) {
          return path.match(/.wasm/) ? wasmPath : (scriptDirectory + path);
        };
      }

      try {
        // [NOTE] Emscripten's then() is NOT really promise-based 'thenable'.
        //        then() must be deleted otherwise it casues infinite loop.
        wasmModule(moduleOverrides).then(wasmModule => {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
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
/* eslint-enable dot-notation */

/* global WorkerGlobalScope */
// Run only if it is in web worker environment
if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
  initWorker()
    .catch(e => {
      throw new Error(`Worker Error: Failed to load the worker: ${e}`);
    });
}
