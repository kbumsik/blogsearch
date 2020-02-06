/**
 * Mocks for SQLite
 */
import type { SearchResult, QueryResult } from '../';

export const mockSQLiteLoad = jest.fn(async function () {
  return Promise.resolve(this);
});

export const mockSQLiteSearch = jest.fn(async function (): Promise<SearchResult[]> {
  return Promise.resolve([
    { TestTitle: 'Title1', TestBody: 'Body1', TestURL: 'URL1' },
    { TestTitle: 'Title2', TestBody: 'Body2', TestURL: 'URL2' },
    { TestTitle: 'Title3', TestBody: 'Body3', TestURL: 'URL3' },
  ]);
});

export const mockSQLiteRun = jest.fn(async function (): Promise<QueryResult[]> {
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
