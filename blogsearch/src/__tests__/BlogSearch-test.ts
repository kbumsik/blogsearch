/* eslint-disable no-new, spaced-comment */
import $ from '../zepto';
import { QueryResult } from '../sqlite/api';
import Hogan from 'hogan.js';
// @ts-ignore
import autocomplete from 'autocomplete.js';
import BlogSearch from '../BlogSearch';

jest.mock('../SQLite');
//@ts-ignore
import SQLite, { mockSQLiteLoad, mockSQLiteSearch, mockSQLiteRun } from '../SQLite';

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
const mockWorker: Worker = {
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
    // Note: If you edit this HTML while doing TDD with `npm run test:watch`,
    // you will have to restart `npm run test:watch` for the new HTML to be
    // updated
    document.body.innerHTML = `
    <div>
      <input id="input" name="search" />
      <span class="i-am-a-span">span span</span>
    </div>
    `;
  });

  afterEach(() => {
    (SQLite as jest.Mock).mockClear();
    mockSQLiteLoad.mockClear();
    mockSQLiteSearch.mockClear();
    mockSQLiteRun.mockClear();

    ((autocomplete as unknown) as jest.Mock).mockClear();
    mockAutoCompleteOn.mockClear();

    ((Hogan.compile as unknown) as jest.Mock).mockClear();
    mockHoganRender.mockClear();
  });

  describe('constructor', () => {
    let defaultOptions: ConstructorParameters<typeof BlogSearch>[0];
    const mockWorkerFactory = jest.fn(() => {
      return {};
    });
    const getInputFromSelector = jest.spyOn(BlogSearch, 'getInputFromSelector') as jest.SpyInstance;
    const checkArguments = jest.spyOn(BlogSearch, 'checkArguments') as jest.SpyInstance;

    afterAll(() => {
      getInputFromSelector.mockRestore();
      checkArguments.mockRestore();
    });

    beforeEach(() => {
      defaultOptions = {
        workerFactory: mockWorkerFactory as any,
        dbPath: 'test.db.bin',
        wasmPath: 'test.wasm',
        inputSelector: '#input',
      };
    });

    afterEach(() => {
      getInputFromSelector.mockReset();
      checkArguments.mockReset();
      mockWorkerFactory.mockClear();
    });

    it('should call checkArguments', () => {
      // Given
      const options = defaultOptions;

      // When
      new BlogSearch(options);

      // Then
      expect(checkArguments).toBeCalledTimes(1);
    });
    it('should pass main options to SQLite constructor', () => {
      // Given
      const options = defaultOptions;

      // When
      new BlogSearch(options);

      // Then
      expect(SQLite).toHaveBeenLastCalledWith({
        wasmPath: 'test.wasm',
        dbPath: 'test.db.bin',
        worker: {},
      });
      expect(mockWorkerFactory).toBeCalledTimes(1);
    });
    it("should call new Worker('.../worker.umd.js') by default", () => {
      // Given
      const options = defaultOptions;
      delete options.workerFactory;

      // When
      new BlogSearch(options);

      // Then
      expect((SQLite as jest.Mock).mock.calls[0][0].worker).toBe(mockWorker);
      expect((Worker as jest.Mock).mock.calls[0][0]).toMatch(/worker.umd.js/);
    });
    it('should call new Worker(window.blogsearch.worker) if exists', () => {
      // [TODO] URL.createObjectURL() not provided by JSDOM figure out a workaround.
    });
    it('should pass the input element as an instance property', () => {
      // Given
      const options = defaultOptions;
      getInputFromSelector.mockImplementation(() => $('<span>foo</span>'));

      // When
      const actual = new BlogSearch(options);

      // Then
      const $inputs = (actual as any).input;
      expect($inputs.text()).toEqual('foo');
      expect($inputs[0].tagName).toEqual('SPAN');
    });
    it('should pass secondary options as instance properties', () => {
      // Given
      const options = {
        ...defaultOptions,
        autocompleteOptions: { anOption: 44 },
      };

      // When
      const actual = new BlogSearch(options as any);

      // Then
      // expect((actual as any).algoliaOptions.anOption).toEqual(42);
      expect((actual as any).autocompleteOptions).toEqual({
        debug: false,
        cssClasses: { prefix: 'ds' },
        anOption: 44,
        ariaLabel: 'search input',
      });
    });
    it('should instantiate autocomplete.js', () => {
      // Given
      const options = {
        ...defaultOptions,
        autocompleteOptions: { anOption: '44' },
      };
      const $input = $('<input name="foo" />');
      getInputFromSelector.mockImplementation(() => $input);

      // When
      new BlogSearch(options as any);

      // Then
      expect(autocomplete).toBeCalledTimes(1);
      expect(((autocomplete as unknown) as jest.Mock).mock.calls[0][0]).toBe($input);
      expect(((autocomplete as unknown) as jest.Mock).mock.calls[0][1]).toStrictEqual({
        anOption: '44',
        cssClasses: { prefix: 'ds' },
        debug: false,
        ariaLabel: 'search input',
      } as any);
    });
    it('should listen to the selected and shown event of autocomplete', () => {
      // Given
      const options = { ...defaultOptions, handleSelected() {} };

      // When
      new BlogSearch(options);

      // Then
      expect(mockAutoCompleteOn).toBeCalledTimes(2);
      expect(mockAutoCompleteOn.mock.calls[0][0]).toBe('autocomplete:selected');
    });
  });

  describe('checkArguments', () => {
    ///@ts-ignore
    let checkArguments: typeof BlogSearch.checkArguments;
    let defaultArgs: ConstructorParameters<typeof BlogSearch>[0];

    beforeEach(() => {
      ///@ts-ignore
      checkArguments = BlogSearch.checkArguments;
      defaultArgs = {
        workerFactory: (() => {}) as any,
        dbPath: 'test.db.bin',
        wasmPath: 'test.wasm',
        inputSelector: '#input',
      };
    });

    it('should throw an error if no dbPath defined', () => {
      // Given
      const options = defaultArgs;
      delete options.dbPath;

      // When
      expect(() => {
        checkArguments(options);
      }).toThrow(/^Usage:/);
    });
    it('should throw an error if dbPath is empty string', () => {
      // Given
      const options = { ...defaultArgs, dbPath: '' };

      // When
      expect(() => {
        checkArguments(options);
      }).toThrow(/^Usage:/);
    });
    it('should throw an error if no wasmPath defined', () => {
      // Given
      const options = defaultArgs;
      delete options.wasmPath;

      // When
      expect(() => {
        checkArguments(options);
      }).toThrow(/^Usage:/);
    });
    it('should throw an error if wasmPath is empty string', () => {
      // Given
      const options = { ...defaultArgs, wasmPath: '' };

      // When
      expect(() => {
        checkArguments(options);
      }).toThrow(/^Usage:/);
    });
    it('should pass if no workerFactory defined', () => {
      // Given
      const options = defaultArgs;
      delete options.workerFactory;

      // When
      expect(() => {
        checkArguments(options);
      }).not.toThrow(/^Usage:/);
    });
    it('should throw an error if workerFactory is not function', () => {
      // Given
      const options = { ...defaultArgs, workerFactory: {} as any };

      // When
      expect(() => {
        checkArguments(options);
      }).toThrow(/^Usage:/);
    });
    it('should throw an error if no selector matches', () => {
      // Given
      const options = defaultArgs;
      const getInputFromSelector = jest.spyOn(
        BlogSearch,
        'getInputFromSelector'
      ) as jest.SpyInstance;
      getInputFromSelector.mockImplementation(() => false);

      // When
      expect(() => {
        checkArguments(options);
      }).toThrow(/^Error:/);
      getInputFromSelector.mockRestore();
    });
  });

  describe('getInputFromSelector', () => {
    ///@ts-ignore
    let getInputFromSelector: typeof BlogSearch.getInputFromSelector;

    beforeEach(() => {
      ///@ts-ignore
      getInputFromSelector = BlogSearch.getInputFromSelector;
    });

    it('should return null if no element matches the selector', () => {
      // Given
      const selector = '.i-do-not-exist > at #all';

      // When
      const actual = getInputFromSelector(selector);

      // Then
      expect(actual).toEqual(null);
    });
    it('should return null if the matched element is not an input', () => {
      // Given
      const selector = '.i-am-a-span';

      // When
      const actual = getInputFromSelector(selector);

      // Then
      expect(actual).toEqual(null);
    });
    it('should return a Zepto wrapped element if it matches', () => {
      // Given
      const selector = '#input';

      // When
      const actual = getInputFromSelector(selector);

      // Then
      ///@ts-ignore
      expect($.zepto.isZ(actual)).toBe(true);
    });
  });


  describe('handleSelected', () => {
    let defaultOptions: ConstructorParameters<typeof BlogSearch>[0];
    const mockAssign = (jest.spyOn(
      window.location,
      'assign'
    ) as jest.SpyInstance).mockImplementation();

    afterAll(() => {
      mockAssign.mockRestore();
    });

    beforeEach(() => {
      defaultOptions = {
        dbPath: 'test.db.bin',
        wasmPath: 'test.wasm',
        inputSelector: '#input',
      };
    });

    afterEach(() => {
      mockAssign.mockClear();
    });

    describe('default handleSelected', () => {
      it('enterKey: should change the page', () => {
        const options = defaultOptions;
        const mockSetVal = jest.fn();
        const mockInput = { setVal: mockSetVal };
        const mockSuggestion = { url: 'www.example.com' };
        const mockContext = { selectionMethod: 'enterKey' };

        (new BlogSearch(options) as any).handleSelected(
          mockInput,
          undefined, // Event
          mockSuggestion,
          undefined, // Dataset
          mockContext
        );

        return new Promise(resolve => {
          expect(mockSetVal).toHaveBeenCalledWith('');
          expect(window.location.assign).toHaveBeenCalledWith('www.example.com');
          resolve();
        });
      });
      it('click: should not change the page', () => {
        const options = defaultOptions;
        const mockSetVal = jest.fn();
        const mockInput = { setVal: mockSetVal };
        const mockContext = { selectionMethod: 'click' };

        (new BlogSearch(options) as any).handleSelected(
          mockInput,
          undefined, // Event
          undefined, // Suggestion
          undefined, // Dataset
          mockContext
        );

        return new Promise(resolve => {
          expect(mockSetVal).not.toHaveBeenCalled();
          expect(window.location.assign).not.toHaveBeenCalled();
          resolve();
        });
      });
    });
  });

  describe('getSuggestionTemplate', () => {
    it('should return a function', () => {
      // Given

      // When
      ///@ts-ignore
      const actual = BlogSearch.getSuggestionTemplate();

      // Then
      expect(actual).toBeInstanceOf(Function);
    });
    describe('returned function', () => {
      it('should compile the suggestion template', () => {
        // Given

        // When
        ///@ts-ignore
        BlogSearch.getSuggestionTemplate();

        // Then
        expect(Hogan.compile).toBeCalledTimes(1);
        expect(Hogan.compile).toHaveBeenLastCalledWith('<div></div>');
      });
      it('should call render on a Hogan template', () => {
        // Given
        ///@ts-ignore
        const actual = BlogSearch.getSuggestionTemplate();

        // When
        actual({ foo: 'bar' });

        // Then
        expect(mockHoganRender).toBeCalledTimes(1);
        expect(mockHoganRender.mock.calls[0][0].foo).toBe('bar');
      });
    });
  });
});
/* eslint-enable no-new, spaced-comment */
