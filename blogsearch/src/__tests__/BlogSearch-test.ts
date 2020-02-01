import SQLite, { SearchResult } from '../SQLite';
import { QueryResult } from '../sqlite/api';
import blogsearch from '../index';
import BlogSearch from '../BlogSearch';
/**
 * [TODO] Really?
 * Pitfalls:
 * Whenever you call new BlogSearch(), it will add the a new dropdown markup to
 * the page. Because we are clearing the document.body.innerHTML between each
 * test, it usually is not a problem.
 * Except that autocomplete.js remembers internally how many times it has been
 * called, and adds this number to classes of elements it creates.
 * DO NOT rely on any .ds-dataset-X, .ds-suggestions-X, etc classes where X is
 * a number. This will change if you add or remove tests and will break your
 * tests.
 **/

const mockSQLiteLoad = jest.fn(function() {
  return Promise.resolve(this);
});

const mockSQLiteSearch = jest.fn(function(): Promise<SearchResult[]> {
  return Promise.resolve([
    { TestTitle: 'Title1', TestBody: 'Body1', TestURL: 'URL1' },
    { TestTitle: 'Title2', TestBody: 'Body2', TestURL: 'URL2' },
    { TestTitle: 'Title3', TestBody: 'Body3', TestURL: 'URL3' },
  ]);
});

const mockSQLiteRun = jest.fn(function(): Promise<QueryResult[]> {
  return Promise.resolve([
    {
      columns: ['TestTitle', 'TestBody', 'TestURL'],
      values: [
        ['Title1', 'Body1', 'URL1'],
        ['Title2', 'Body2', 'URL2'],
        ['Title3', 'Body3', 'URL3'],
      ],
    },
  ]);
});

jest.mock('../SQLite', () => {
  return jest.fn().mockImplementation(() => {
    return {
      load: mockSQLiteLoad,
      search: mockSQLiteSearch,
      run: mockSQLiteRun,
    };
  });
});

process.on('unhandledRejection', err => {
  fail(err);
});

describe('BlogSearch', () => {
  const blogsearchArgs = {
    workerFactory: (() => jest.fn()) as any,
    dbPath: '/test.db.bin',
    wasmPath: 'test.wasm',
    inputSelector: '#input',
  };

  beforeEach(() => {
    // Note: If you edit this HTML while doing TDD with `npm run test:watch`,
    // you will have to restart `npm run test:watch` for the new HTML to be
    // updated
    document.body.innerHTML = `
    <div>
      <input id="input" name="search" />
      <span class="i-am-a-span">span span</span>
    </div>
    `;

    (SQLite as jest.Mock).mockClear();
    mockSQLiteLoad.mockClear();
    mockSQLiteSearch.mockClear();
    mockSQLiteRun.mockClear();
  });

  describe('index.ts', () => {
    it('should instantiate BlogSearch object for public use', done => {
      blogsearch(blogsearchArgs).then((obj: BlogSearch) => {
        expect(obj).toBeInstanceOf(BlogSearch);
        done();
      });
    });

    it('should call BlogSearch.load()', () => {
      const load = spyOn(BlogSearch.prototype, 'load');
      blogsearch(blogsearchArgs);
      expect(load).toHaveBeenCalledTimes(1);
      expect(SQLite).toHaveBeenCalledTimes(1);
    });
  });
});
