import Hogan from 'hogan.js';
import autocomplete, {
  Suggestion,
  AutocompleteOptions,
  AutocompleteElement,
} from './autocomplete.js';
import SQLite, * as SQL from './sqlite';
import templates from './templates';
import $ from './zepto';

declare global {
  interface Window {
    // 'blogsearch' object will be available when imported by UMD using <script> tag.
    blogsearch: BlogSearch & {
      // blogsearch.worker is also imported by its own UMD.
      // In this case, you can it blob to get URL to use with Woker().
      worker?: Worker;
    };
  }
}

interface Config {
  workerFactory?: () => Worker;
  inputSelector: string;
  debug?: boolean;
  autocompleteOptions?: AutocompleteOptions;
}

const usage = `Usage:
blogsearch({
  dbPath: string,
  inputSelector: string (CSS selector),
  wasmPath: (optional) string,
  workerFactory: (optional) function that returns a Web Worker,
})`;

class BlogSearch {

  private constructor (
    private readonly sqlite: SQLite,
    private readonly autoComplete: AutocompleteElement,
  ) {}

  public static async create ({
    workerFactory,
    wasmPath = getCurrentDir('blogsearch.wasm'),
    dbPath = '',
    inputSelector = '',
    debug = false,
    autocompleteOptions = {
      debug: false,
      hint: false,
      autoselect: true,
      cssClasses: {},
      ariaLabel: '',
    },
  }: Config & SQL.Config) {
    BlogSearch.checkArguments(arguments[0]);

    let searchReady = false;
    const autoComplete = getAutoComplete();
    const sqlite = await new SQLite({
      wasmPath,
      dbPath,
      worker: getWorkerFactory(workerFactory)(),
    }).load();
    searchReady = true;
    return new BlogSearch(sqlite, autoComplete);

    function getAutoComplete () {
      const selector = getInputFromSelector(inputSelector);
      const template = Hogan.compile(templates.suggestion);
      const emptyTemplate = Hogan.compile(templates.empty);
      const autoComplete = autocomplete(
        selector,
        options(autocompleteOptions, selector, debug),
        [
          // Autocomplete sources
          {
            source: searchSource(),
            templates: {
              suggestion: (suggestion) => template.render(suggestion),
              empty: (suggestion) => emptyTemplate.render(suggestion),
            },
          },
        ]
      );
      // Reference: https://github.com/algolia/autocomplete.js#events
      autoComplete.on(
        'autocomplete:selected',
        handleSelected.bind(null, autoComplete.autocomplete)
      );
      autoComplete.on(
        'autocomplete:shown',
        handleShown.bind(null, selector)
      );
      return autoComplete;
      
      function options (
        options: AutocompleteOptions,
        input: JQuery<HTMLElement>,
        debugFlag: boolean
      ): AutocompleteOptions {
        const inputAriaLabel = typeof input?.attr === 'function' ? input.attr('aria-label') : undefined;
        return {
          ...options,
          debug: debugFlag ?? options.debug ?? false,
          cssClasses: {
            root: 'blogsearch-autocomplete',
            prefix: 'bs',
            ...options.cssClasses,
          },
          ariaLabel: options.ariaLabel ?? inputAriaLabel ?? 'search input',
        };
      }
      
      /**
       * Returns the `source` method to be passed to autocomplete.js. It will query
       * the Algolia index and call the callbacks with the formatted hits.
       * @function getAutocompleteSource
       * @returns {function} Method to be passed as the `source` option of
       * autocomplete
       */
      function searchSource () {
        return async (
          query: string,
          showSearchResult: (suggestion: Suggestion[]) => void
        ) => {
          if (!searchReady) return;
          const suggestions = <Suggestion[]><unknown[]>await sqlite.search(query, 5);
          showSearchResult(suggestions.map(suggestion => ({
            ...suggestion,
            tags: (<string>suggestion.tags ?? '')
              .split(',')
              .map(str => ({ value: str.trim() })),
            categories: (<string>suggestion.categories ?? '')
              .split(',')
              .map(str => ({ value: str.trim() })),
          })));
          return;
        };
      }

      function handleSelected (
        input: any,
        _event: any,
        suggestion: Suggestion,
        _datasetNumber: any,
        context: any = {},
      ) {
        // Do nothing if click on the suggestion, as it's already a <a href>, the
        // browser will take care of it. This allow Ctrl-Clicking on results and not
        // having the main window being redirected as well
        if (context.selectionMethod === 'click') {
          return;
        }

        input.setVal('');
        window.location.assign(suggestion.url);
      }

      function handleShown (input: JQuery<HTMLElement>) {
        // @ts-ignore
        const middleOfInput = input.offset().left + input.width() / 2;
        // @ts-ignore
        let middleOfWindow = $(document).width() / 2;

        if (isNaN(middleOfWindow)) {
          middleOfWindow = 900;
        }

        const alignClass =
          middleOfInput - middleOfWindow >= 0
            ? 'blogsearch-autocomplete-right'
            : 'blogsearch-autocomplete-left';
        const otherAlignClass =
          middleOfInput - middleOfWindow < 0
            ? 'blogsearch-autocomplete-right'
            : 'blogsearch-autocomplete-left';
        const autocompleteWrapper = $('.blogsearch-autocomplete');
        if (!autocompleteWrapper.hasClass(alignClass)) {
          autocompleteWrapper.addClass(alignClass);
        }

        if (autocompleteWrapper.hasClass(otherAlignClass)) {
          autocompleteWrapper.removeClass(otherAlignClass);
        }
      }
    }
  }

  private static checkArguments (args: Config & SQL.Config) {
    if (
      typeof args.dbPath !== 'string' || !args.dbPath ||
      typeof args.inputSelector !== 'string' || !args.inputSelector ||
      (typeof args.workerFactory !== 'undefined' && typeof args.workerFactory !== 'function')
    ) {
      throw new Error(usage);
    }
    getInputFromSelector(args.inputSelector);
  }

  public close () {
    this.sqlite.close();
    this.autoComplete.autocomplete.destroy();
    return;
  }
}

function getWorkerFactory (factory?: () => Worker) {
  if (typeof factory !== 'undefined') {
    return factory;
  }
  // Get current directory for worker
  const workerDir = typeof window?.blogsearch?.worker === 'function'
    ? URL.createObjectURL(new Blob([`(${window.blogsearch.worker})()`]))
    : getCurrentDir('worker.umd.js');
  return () => new Worker(workerDir);
}

const getCurrentDir = (() => {
  /**
   * This must be processed in the top-level, before blogsearch() initialization
   * code is called. This is because blogsearch() can be called in a different
   * <script> tag.
   */
  const curDir = (document.currentScript as HTMLScriptElement)?.src ?? self.location?.href ?? '';
  return function (fileName: string) {
    // This assumes that worker.umd.js is available in the CDN (e.g. JSDelivr).
    return `${curDir.substr(0, curDir.lastIndexOf('/'))}/${fileName}`;
  }
})();

/**
 * Returns the matching input from a CSS selector, null if none matches
 * @function getInputFromSelector
 * @param  {string} selector CSS selector that matches the search
 * input of the page
 */
function getInputFromSelector (selector: string) {
  const input = $(selector).filter('input');
  if (!input?.length) {
    throw new Error(`Error: No input element in the page matches ${selector}`);
  }
  return $(input[0]);
}

export default BlogSearch;
