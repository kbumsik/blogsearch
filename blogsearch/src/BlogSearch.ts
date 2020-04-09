import Hogan from 'hogan.js';
import autocomplete, {
  Suggestion,
  AutocompleteElement,
  AutocompleteOptions,
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
  layout?: 'columns' | 'simple';
}

const usage = `Usage:
blogsearch({
  dbPath: string,
  inputSelector: string (CSS selector),
  wasmPath: (optional) string,
  workerFactory: (optional) function that returns a Web Worker,
})`;

class BlogSearch {
  private readonly sqlite: SQLite;
  private readonly startAutoComplete: () => void;

  public constructor ({
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
    layout = 'simple',
  }: Config & SQL.Config) {
    checkArguments({ workerFactory, wasmPath, dbPath, inputSelector, debug, autocompleteOptions, layout });

    this.sqlite = new SQLite({
      wasmPath,
      dbPath,
      worker: getWorkerFactory(workerFactory)(),
    });

    this.startAutoComplete = () => {
      const selector = BlogSearch.getInputFromSelector(inputSelector);
      const autocompleteEngine = autocomplete(
        selector,
        configAutoCompleteOptions(autocompleteOptions, selector, debug),
        [
          {
            source: this.getAutocompleteSource(),
            templates: {
              suggestion: BlogSearch.getSuggestionTemplate(layout === 'simple'),
              footer: templates.footer,
              empty: BlogSearch.getEmptyTemplate(),
            },
          },
        ]
      );
      // Reference: https://github.com/algolia/autocomplete.js#events
      autocompleteEngine.on(
        'autocomplete:selected',
        this.handleSelected.bind(null, autocompleteEngine.autocomplete)
      );
      autocompleteEngine.on(
        'autocomplete:shown',
        this.handleShown.bind(null, selector)
      );
    };
    return;

    function checkArguments (args: Config & SQL.Config) {
      if (
        typeof args.dbPath !== 'string' || !args.dbPath ||
        typeof args.inputSelector !== 'string' || !args.inputSelector ||
        (typeof args.workerFactory !== 'undefined' && typeof args.workerFactory !== 'function')
      ) {
        throw new Error(usage);
      }
      BlogSearch.getInputFromSelector(args.inputSelector);
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

    function configAutoCompleteOptions (
      options: AutocompleteOptions,
      input: JQuery<HTMLElement>,
      debugFlag: boolean
    ): AutocompleteOptions {
      const inputAriaLabel = typeof input?.attr === 'function' ? input.attr('aria-label') : undefined;
      return {
        ...options,
        debug: debugFlag ?? options.debug ?? false,
        cssClasses: {
          prefix: 'ds',
          ...options.cssClasses,
        },
        ariaLabel: options.ariaLabel ?? inputAriaLabel ?? 'search input',
      };
    }
  }

  public async load (): Promise<BlogSearch> {
    await this.sqlite.load();
    const meta = await this.sqlite.run(
      "SELECT `name`, `sql` FROM `sqlite_master` WHERE type='table';"
    );
    // eslint-disable-next-line no-console
    console.log(meta);
    this.startAutoComplete();
    return this;
  }

  /**
   * Returns the matching input from a CSS selector, null if none matches
   * @function getInputFromSelector
   * @param  {string} selector CSS selector that matches the search
   * input of the page
   * @returns {void}
   */
  private static getInputFromSelector (selector: string) {
    const input = $(selector).filter('input');
    if (!input?.length) {
      throw new Error(`Error: No input element in the page matches ${selector}`);
    }
    return $(input[0]);
  }

  /**
   * Returns the `source` method to be passed to autocomplete.js. It will query
   * the Algolia index and call the callbacks with the formatted hits.
   * @function getAutocompleteSource
   * @returns {function} Method to be passed as the `source` option of
   * autocomplete
   */
  private getAutocompleteSource () {
    return async (query: string, callback: (suggestion: Suggestion[]) => void) => {
      if (typeof this.sqlite === 'undefined') {
        throw new Error('Error: Search engine is not loaded.');
      }
      const searchResult = await this.sqlite.search(query, 5);
      // eslint-disable-next-line no-console
      console.log(searchResult);
      if (searchResult.length > 0) {
        callback(formatSuggestions(searchResult));
      }
      return;

      function formatSuggestions (results: SQL.SearchResult[]): Suggestion[] {
        return results.map((row): Suggestion => {
          return {
            isLvl0: false,
            isLvl1: true,
            isLvl2: false,
            isLvl1EmptyOrDuplicate: false,
            isCategoryHeader: true,
            isSubCategoryHeader: true,
            isTextOrSubcategoryNonEmpty: true,
            category: row.title,
            subcategory: row.title,
            title: row.title,
            text: row.body,
            url: row.url,
          };
        });
      }
    };
  }

  private static getEmptyTemplate () {
    return (args: Hogan.Context) => Hogan.compile(templates.empty).render(args);
  }

  private static getSuggestionTemplate (isSimpleLayout: boolean) {
    const stringTemplate = isSimpleLayout ? templates.suggestionSimple : templates.suggestion;
    const template = Hogan.compile(stringTemplate);
    return (suggestion: Hogan.Context) => template.render(suggestion);
  }

  private handleSelected (
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

  private handleShown (input: JQuery<HTMLElement>) {
    // @ts-ignore
    const middleOfInput = input.offset().left + input.width() / 2;
    // @ts-ignore
    let middleOfWindow = $(document).width() / 2;

    if (isNaN(middleOfWindow)) {
      middleOfWindow = 900;
    }

    const alignClass =
      middleOfInput - middleOfWindow >= 0
        ? 'algolia-autocomplete-right'
        : 'algolia-autocomplete-left';
    const otherAlignClass =
      middleOfInput - middleOfWindow < 0
        ? 'algolia-autocomplete-right'
        : 'algolia-autocomplete-left';
    const autocompleteWrapper = $('.algolia-autocomplete');
    if (!autocompleteWrapper.hasClass(alignClass)) {
      autocompleteWrapper.addClass(alignClass);
    }

    if (autocompleteWrapper.hasClass(otherAlignClass)) {
      autocompleteWrapper.removeClass(otherAlignClass);
    }
  }
}

function getCurrentDir (fileName: string) {
  const curDir =
    (document.currentScript as HTMLScriptElement)?.src ?? self.location?.href ?? '';
  // This assumes that worker.umd.js is available in the CDN (e.g. JSDelivr).
  return `${curDir.substr(0, curDir.lastIndexOf('/'))}/${fileName}`;
}

export default BlogSearch;
