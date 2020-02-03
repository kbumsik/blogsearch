import type {
  QueryResult,
  SQLResultColumns,
  SQLParameterArray,
  SQLParameterFields,
} from './sqlite3';

// Export again from sqlite3, for use in other modules
export {
  QueryResult,
  SQLResultColumns,
} from './sqlite3';

export interface SQLiteConfig {
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

  interface OpenCommand extends SQLiteConfig {
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
