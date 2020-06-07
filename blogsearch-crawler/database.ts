// This is an "promisified" version of sqlite3
import * as sqlite from 'sqlite';
// This is only need for constants declarations
import { OPEN_CREATE, OPEN_READWRITE } from 'sqlite3';
import { FieldsMap, ParsedFieldsMap, ParsedFields } from './configTypes';

const BLOGSEARCH = 'blogsearch';
const BLOGSEARCH_EXT_CONTENT = 'blogsearch_ext_content';

export class Database {
  private constructor (
    private readonly db: sqlite.Database,
    private readonly columns: FieldsMap,
  ) {}

  public static async create ({
    filename,
    columns
  }: {
    filename: string;
    columns: FieldsMap;
  }) {
    const db = await sqlite.open(
      filename,
      {
        mode: (OPEN_CREATE | OPEN_READWRITE),
        verbose: true
      }
    );
    columns = filterMap(columns, field => field.enabled);
    return (new Database(db, columns)).init();
  }

  private async init () {
    // const thisFunc = this.db.run.bind(this.db);
    // // @ts-ignore
    // this.db.run = async (...args: any[]) => {
    //   console.log(args[0].toString());
    //   await thisFunc(...args);
    // };

    // Reference: https://www.sqlite.org/fts5.html
    /**
     * Create a virtual table 'blogsearch'
     * We use the fts5 extension to support full-text search out of the box.
     */
    await this.db.run(`
      CREATE VIRTUAL TABLE ${BLOGSEARCH}
      USING fts5(
        ${[...this.columns.entries()]
          .map(([field, config]) => `${field}${config.indexed ? '' : ' UNINDEXED'}`)
          .join(',')},
        tokenize = 'porter unicode61 remove_diacritics 1',
        content=${BLOGSEARCH_EXT_CONTENT},
        content_rowid=rowid
      );
    `);
    /**
     * Create table 'blogsearch_ext_content'. This is an external content table
     * for FTS5. External content table is used to support "hasConent" feature
     * that helps reducing the size of the output db file.
     */
    await this.db.run(`
      CREATE TABLE ${BLOGSEARCH_EXT_CONTENT} (
        rowid INTEGER PRIMARY KEY,
        ${[...this.columns.entries()]
          .map(([field, _]) => field)
          .join(',')}
      );
    `);
    return this;
  }

  public async insert (
    rowid: number,
    columns: ParsedFields | ParsedFieldsMap
  ) {
    // if object, construct a map with the correct order.
    if (!(columns instanceof Map)) {
      const columnsObj = columns;
      columns = new Map();
      for (const [field, config] of this.columns) {
        columns.set(field, {
          value: columnsObj[field],
          config
        });
      }
    }

    /**
     * Insert the parsed content first.
     */
    await this.db.run(`
      INSERT INTO ${BLOGSEARCH_EXT_CONTENT}
      VALUES (
        ${rowid},
        ${[...columns.values()]
          .map(({ value, config }) => config.hasContent ? value : '')
          .map(value => `'${value.replace(/'/g, "''")}'`) // A single quote should be encoded to two single quotes: https://www.sqlite.org/lang_expr.html
          .join(',')}
      );
    `);
    /**
     * When inserting a row in the fts table, it only indexes content but does
     * not actually store content.
     */
    await this.db.run(`
      INSERT INTO ${BLOGSEARCH} (
        rowid,
        ${[...columns.keys()].join(',')}
      )
      VALUES (
        ${rowid},
        ${[...columns.values()]
          .map(({ value }) => value)
          .map(value => `'${value.replace(/'/g, "''")}'`) // The same as above
          .join(',')}
      );
    `);
  }

  public async close () {
    await this.db.close();
  }
}

function filterMap<K, V> (map: Map<K, V>, callback: (value: V) => boolean) {
  const newMap = new Map();
  for (const [key, value] of map) {
    if (callback(value)) {
      newMap.set(key, value);
    }
  }
  return newMap;
}
