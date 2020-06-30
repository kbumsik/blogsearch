/* eslint-disable no-new, @typescript-eslint/no-empty-function */
import $ from '../zepto';
import Hogan from 'hogan.js';
import autocomplete from '../autocomplete.js';
import BlogSearch from '../BlogSearch';
// @ts-ignore
import SQLite, { mockSQLiteLoad, mockSQLiteSearch, mockSQLiteRun } from '../sqlite';

// Have __mocks__
jest.mock('../sqlite');

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

// Catch any error inside of promise
process.on('unhandledRejection', err => {
  fail(err);
});

/**
 * Mocks for Hogan and template
 */
jest.mock('../templates', () => ({
  suggestion: '<div></div>',
}));

const mockHoganRender = jest.fn();
jest.mock('hogan.js', () => {
  return {
    compile: jest.fn(() => ({ render: mockHoganRender })),
  };
});

/**
 * Mocks for autocomplete.js
 */
const mockAutoCompleteOn = jest.fn();

jest.mock('autocomplete.js', () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: mockAutoCompleteOn,
    };
  });
});

/**
 * Mocks for Web Worker
 */
const mockWorker = {
  postMessage: jest.fn(),
  onmessage: jest.fn(),
  onerror: jest.fn(),
  terminate: jest.fn(),
  dispatchEvent: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

Object.defineProperty(window, 'Worker', {
  writable: true,
  value: jest.fn().mockImplementation(() => mockWorker),
});

/**
 * Main test
 */
describe('BlogSearch', () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <div>
      <input id="input" name="search" />
      <span class="i-am-a-span">span span</span>
    </div>
    `;
  });

  afterEach(() => {
    SQLite.mockClear();
    mockSQLiteLoad.mockClear();
    mockSQLiteSearch.mockClear();
    mockSQLiteRun.mockClear();

    autocomplete.mockClear();
    mockAutoCompleteOn.mockClear();

    Hogan.compile.mockClear();
    mockHoganRender.mockClear();
  });

  describe('create()', () => {
    let defaultOptions;
    const mockWorkerFactory = jest.fn(() => {
      return {};
    });
    let getInputFromSelector;

    beforeEach(() => {
      defaultOptions = {
        workerFactory: mockWorkerFactory,
        dbPath: 'test.db.wasm',
        wasmPath: 'test.wasm',
        inputSelector: '#input',
      };
      // @ts-ignore
      getInputFromSelector = jest.spyOn(BlogSearch, 'getInputFromSelector');
    });

    afterEach(() => {
      getInputFromSelector.mockRestore();
      mockWorkerFactory.mockClear();
    });

    it('should pass main options to SQLite constructor', async () => {
      // Given
      const options = defaultOptions;

      // When
      await BlogSearch.create(options);

      // Then
      expect(SQLite).toHaveBeenLastCalledWith({
        wasmPath: 'test.wasm',
        dbPath: 'test.db.wasm',
        worker: {},
      });
      expect(mockWorkerFactory).toBeCalledTimes(1);
    });
    it('should instantiate autocomplete.js', async () => {
      // Given
      const options = {
        ...defaultOptions,
        autocompleteOptions: { anOption: '44' },
      };
      const $input = $('<input name="foo" />');
      getInputFromSelector.mockImplementation(() => $input);

      // When
      await BlogSearch.create(options);

      // Then
      expect(autocomplete).toBeCalledTimes(1);
      expect(autocomplete.mock.calls[0][0]).toBe($input);
      expect(autocomplete.mock.calls[0][1]).toStrictEqual({
        anOption: '44',
        cssClasses: {
          root: 'blogsearch-autocomplete',
          prefix: 'bs'
        },
        debug: false,
        ariaLabel: 'search input',
      });
    });
    it('should initialize this.sqlite object', async () => {
      // Given
      const options = defaultOptions;

      // When
      const blogsearch = await BlogSearch.create(options);

      // Then
      // @ts-ignore
      expect(typeof blogsearch.sqlite).toBe('object');
    });
    it('should not run any query', async () => {
      // Given
      const options = defaultOptions;

      // When
      const blogsearch = await BlogSearch.create(options);

      // Then
      // @ts-ignore
      expect(mockSQLiteRun).toBeCalledTimes(0);
    });
    it('should listen to the selected and shown event of autocomplete', async () => {
      // Given
      const options = { ...defaultOptions, handleSelected () { return; } };

      // When
      const blogsearch = await BlogSearch.create(options);

      // Then
      expect(mockAutoCompleteOn).toBeCalledTimes(2);
      expect(mockAutoCompleteOn.mock.calls[0][0]).toBe('autocomplete:selected');
    });

    describe('Arguments', () => {
      it('should throw an error if no dbPath defined', async () => {
        // Given
        const options = defaultOptions;
        delete options.dbPath;

        // When
        expect(async () => {
          await BlogSearch.create(options);
        }).toThrow(/^Usage:/);
      });
      it('should use the default wasmPath if no wasmPath defined', async () => {
        // Given
        const options = defaultOptions;
        delete options.wasmPath;

        // When
        await BlogSearch.create(options);

        // Then
        expect(SQLite.mock.calls[0][0].wasmPath).toMatch(/\/\/localhost\/blogsearch.wasm/);
      });
      it('should pass if no workerFactory defined', async () => {
        // Given
        const options = defaultOptions;
        delete options.workerFactory;

        // When
        expect(async () => {
          await BlogSearch.create(options);
        }).not.toThrow(/^Usage:/);
      });
      it('should throw an error if workerFactory is not function', async () => {
        // Given
        const options = { ...defaultOptions, workerFactory: {}};

        // When
        expect(async () => {
          await BlogSearch.create(options);
        }).toThrow(/^Usage:/);
      });
      it('should throw an error if no selector matches', async () => {
        // Given
        const options = { ...defaultOptions, inputSelector: 'noMatch' };

        // When
        expect(async () => {
          await BlogSearch.create(options);
        }).toThrow(/^Error:/);
      });
    });

    describe('getWorkerFactory', () => {
      it("should call new Worker('.../worker.umd.js') by default", async () => {
        // Given
        const options = defaultOptions;
        delete options.workerFactory;

        // When
        await BlogSearch.create(options);

        // Then
        expect(SQLite.mock.calls[0][0].worker).toBe(mockWorker);
        expect(Worker.mock.calls[0][0]).toMatch(/\/\/localhost\/worker.umd.js/);
      });
      it('should call new Worker(window.blogsearch.worker) if exists', () => {
        // [TODO] URL.createObjectURL() not provided by JSDOM figure out a workaround.
      });
    });
    // describe('startAutoComplete', () => {
    //   it('should compile the suggestion template', () => {
    //     // Given

    //     // When
    //     // @ts-ignore
    //     BlogSearch.getSuggestionTemplate();

    //     // Then
    //     expect(Hogan.compile).toBeCalledTimes(1);
    //     expect(Hogan.compile).toHaveBeenLastCalledWith('<div></div>');
    //   });
    // })
  });

  // describe('getInputFromSelector', () => {
  //   // @ts-ignore
  //   let getInputFromSelector;

  //   beforeEach(() => {
  //     // @ts-ignore
  //     getInputFromSelector = BlogSearch.getInputFromSelector;
  //   });

  //   it('should throw an error if no element matches the selector', () => {
  //     // Given
  //     const selector = '.i-do-not-exist > at #all';

  //     // When
  //     expect(() => {
  //       getInputFromSelector(selector);
  //     }).toThrow(/^Error: No input element in the page matches/);
  //   });
  //   it('should throw an error if the matched element is not an input', () => {
  //     // Given
  //     const selector = '.i-am-a-span';

  //     // When
  //     expect(() => {
  //       getInputFromSelector(selector);
  //     }).toThrow(/^Error: No input element in the page matches/);
  //   });
  //   it('should return a Zepto wrapped element if it matches', () => {
  //     // Given
  //     const selector = '#input';

  //     // When
  //     const actual = getInputFromSelector(selector);

  //     // Then
  //     // @ts-ignore
  //     expect($.zepto.isZ(actual)).toBe(true);
  //   });
  // });

  // describe('searchSource', () => {
  //   let blogsearch;
  //   beforeEach(async () => {
  //     blogsearch = new BlogSearch({
  //       dbPath: 'test.db.wasm',
  //       wasmPath: 'test.wasm',
  //       inputSelector: '#input',
  //     });
  //     await blogsearch.load();
  //   });

  //   it('returns a function', () => {
  //     // Given
  //     // @ts-ignore
  //     const actual = blogsearch.getAutocompleteSource();

  //     // When

  //     // Then
  //     expect(actual).toBeInstanceOf(Function);
  //   });

  //   describe('the returned function', () => {
  //     it('calls the sqlite client with the correct parameters', async () => {
  //       // Given
  //       // @ts-ignore
  //       const actual = blogsearch.getAutocompleteSource();

  //       // When
  //       await actual('query', () => {});

  //       // Then
  //       expect(mockSQLiteSearch).toBeCalledTimes(1);
  //       expect(mockSQLiteSearch).toHaveBeenLastCalledWith('query', 5);
  //     });
  //   });
  // });

  // describe('getSuggestionTemplate', () => {
  //   it('should return a function', () => {
  //     // Given

  //     // When
  //     // @ts-ignore
  //     const actual = BlogSearch.getSuggestionTemplate();

  //     // Then
  //     expect(actual).toBeInstanceOf(Function);
  //   });
  //   describe('returned function', () => {
  //     it('should call render on a Hogan template', () => {
  //       // Given
  //       // @ts-ignore
  //       const actual = BlogSearch.getSuggestionTemplate();

  //       // When
  //       actual({ foo: 'bar' });

  //       // Then
  //       expect(mockHoganRender).toBeCalledTimes(1);
  //       expect(mockHoganRender.mock.calls[0][0].foo).toBe('bar');
  //     });
  //     it('should convert tags to an array', () => {
  //       // Given
  //       // @ts-ignore
  //       const actual = BlogSearch.getSuggestionTemplate();

  //       // When
  //       actual({ tags: ' tag-1, tag-2 ' });

  //       // Then
  //       expect(mockHoganRender).toBeCalledTimes(1);
  //       expect(mockHoganRender.mock.calls[0][0]).toStrictEqual({
  //         tags: [{ value: 'tag-1' }, { value: 'tag-2' }]
  //       });
  //     });
  //     it('should convert categories to an array', () => {
  //       // Given
  //       // @ts-ignore
  //       const actual = BlogSearch.getSuggestionTemplate();

  //       // When
  //       actual({ categories: ' category-1, category-2 ' });

  //       // Then
  //       expect(mockHoganRender).toBeCalledTimes(1);
  //       expect(mockHoganRender.mock.calls[0][0]).toStrictEqual({
  //         categories: [{ value: 'category-1' }, { value: 'category-2' }]
  //       });
  //     });
  //   });
  // });
});
/* eslint-enable no-new, @typescript-eslint/no-empty-function */
