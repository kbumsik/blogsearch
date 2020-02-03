/**
 * Mocks for SQLite
 */
import { SearchResult } from '../SQLite';
import { QueryResult } from '../sqlite/worker-interface';

export const mockSQLiteLoad = jest.fn(function() {
  return Promise.resolve(this);
});

export const mockSQLiteSearch = jest.fn(function(): Promise<SearchResult[]> {
  return Promise.resolve([
    { TestTitle: 'Title1', TestBody: 'Body1', TestURL: 'URL1' },
    { TestTitle: 'Title2', TestBody: 'Body2', TestURL: 'URL2' },
    { TestTitle: 'Title3', TestBody: 'Body3', TestURL: 'URL3' },
  ]);
});

export const mockSQLiteRun = jest.fn(function(): Promise<QueryResult[]> {
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

const mock = jest.fn().mockImplementation(() => {
  return {
    load: mockSQLiteLoad,
    search: mockSQLiteSearch,
    run: mockSQLiteRun,
  };
});

export default mock;
