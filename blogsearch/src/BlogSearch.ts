import Hogan from 'hogan.js';
import autocomplete, {
  Suggestion,
  AutocompleteElement,
  AutocompleteOptions,
} from './autocomplete.js';
import SQLite, { SearchResult as SQLiteResult, SQLiteConfig } from './sqlite';
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

/**
 * Adds an autocomplete dropdown to an input field
 * @function DocSearch
 * @param  {string} options.apiKey         Read-only API key
 * @param  {string} options.indexName      Name of the index to target
 * @param  {string} options.inputSelector  CSS selector that targets the input
 * @param  {string} [options.appId]  Lets you override the applicationId used.
 * If using the default Algolia Crawler, you should not have to change this
 * value.
 * @param  {Object} [options.algoliaOptions] Options to pass the underlying Algolia client
 * @param  {Object} [options.autocompleteOptions] Options to pass to the underlying autocomplete instance
 * @return {Object}
 */
const usage = `Usage:
  blogsearch({
    workerFactory: Function,
    wasmPath: string,
    dbPath: string,
    inputSelector: string (CSS selector),
})`;

interface Config {
  workerFactory?: () => Worker;
  inputSelector: string;
  debug?: boolean;
  autocompleteOptions?: AutocompleteOptions;
  layout?: 'columns' | 'simple';
}

type Args = Config & SQLiteConfig;

class BlogSearch {
  // private indexName: Config['indexName'];
  private input: JQuery<HTMLElement>;
  private autocompleteOptions: AutocompleteOptions;
  private autocomplete: AutocompleteElement;
  private sqlite: SQLite;
  private sqlitePromise: Promise<SQLite>;
  private workerFactory: () => Worker;

  public constructor({
    workerFactory,
    wasmPath,
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
    layout = 'columns',
  }: Args) {
    BlogSearch.checkArguments({
      workerFactory,
      wasmPath,
      dbPath,
      inputSelector,
      debug,
      autocompleteOptions,
      layout,
    });

    // Set worker and then inittialize.
    this.workerFactory = getWorkerFactory();
    this.sqlitePromise = new SQLite({ wasmPath, dbPath, worker: this.workerFactory() }).load();

    // autocomplete.js configuration
    this.input = BlogSearch.getInputFromSelector(inputSelector)!;
    const autocompleteOptionsDebug =
      autocompleteOptions && autocompleteOptions.debug ? autocompleteOptions.debug : false;
    // eslint-disable-next-line no-param-reassign
    autocompleteOptions.debug = debug || autocompleteOptionsDebug;
    this.autocompleteOptions = autocompleteOptions;
    this.autocompleteOptions.cssClasses = this.autocompleteOptions.cssClasses || {};
    this.autocompleteOptions.cssClasses.prefix = this.autocompleteOptions.cssClasses.prefix || 'ds';
    const inputAriaLabel =
      this.input && typeof this.input.attr === 'function' && this.input.attr('aria-label');
    this.autocompleteOptions.ariaLabel =
      this.autocompleteOptions.ariaLabel || inputAriaLabel || 'search input';

    // Initialize autocomplete.js
    this.autocomplete = autocomplete(this.input, autocompleteOptions, [
      {
        source: this.getAutocompleteSource(),
        templates: {
          suggestion: BlogSearch.getSuggestionTemplate(layout === 'simple'),
          footer: templates.footer,
          empty: BlogSearch.getEmptyTemplate(),
        },
      },
    ]);
    return;

    function getWorkerFactory() {
      if (typeof workerFactory !== 'undefined') {
        return workerFactory;
      }
      // Get current directory for worker
      const workerDir = (() => {
        if (typeof window?.blogsearch?.worker === 'function') {
          // See the global delcaration in the top of this file
          return URL.createObjectURL(new Blob([`(${window?.blogsearch?.worker})()`]));
        } else {
          const curDir =
            document.currentScript ? (document.currentScript as HTMLScriptElement).src :
            self.location ? self.location.href :
            '';
          // This assumes that worker.umd.js is available in the NPM package.
          return `${curDir.substr(0, curDir.lastIndexOf('/'))}/worker.umd.js`;
        }
      })();
      return () => new Worker(workerDir);
    }
  }

  public async load(): Promise<BlogSearch>{
    this.sqlite = await this.sqlitePromise;
    const meta = await this.sqlite.run("SELECT `name`, `sql` FROM `sqlite_master` WHERE type='table';")
    
    this.autocomplete.on(
      'autocomplete:selected',
      this.handleSelected.bind(null, this.autocomplete.autocomplete)
    );
    this.autocomplete.on(
      'autocomplete:shown',
      this.handleShown.bind(null, this.input)
    );
    return this;
  }

  /**
   * Checks that the passed arguments are valid. Will throw errors otherwise
   * @function checkArguments
   * @param  {object} args Arguments as an option object
   * @returns {void}
   */
  private static checkArguments(args: Args) {
    if (
      /* eslint-disable prettier/prettier */
      typeof args.dbPath !== 'string' || !args.dbPath ||
      typeof args.wasmPath !== 'string' || !args.wasmPath ||
      typeof args.inputSelector !== 'string' || !args.inputSelector ||
      (typeof args.workerFactory !== 'undefined' && typeof args.workerFactory !== 'function')
      /* eslint-enable prettier/prettier */
    ) {
      throw new Error(usage);
    }

    if (!BlogSearch.getInputFromSelector(args.inputSelector)) {
      throw new Error(`Error: No input element in the page matches ${args.inputSelector}`);
    }
  }

  /**
   * Returns the matching input from a CSS selector, null if none matches
   * @function getInputFromSelector
   * @param  {string} selector CSS selector that matches the search
   * input of the page
   * @returns {void}
   */
  private static getInputFromSelector(selector: string) {
    const input = $(selector).filter('input');
    return input.length ? $(input[0]) : null;
  }

  /**
   * Returns the `source` method to be passed to autocomplete.js. It will query
   * the Algolia index and call the callbacks with the formatted hits.
   * @function getAutocompleteSource
   * @returns {function} Method to be passed as the `source` option of
   * autocomplete
   */
  private getAutocompleteSource() {
    return async (
      query: string,
      callback: (suggestion: Suggestion[]) => void
    ) => {
      if (typeof this.sqlite === 'undefined') {
        throw new Error('Error: Search engine is not loaded.');
      }
      const searchResult = await this.sqlite.search(query, 5);
      // eslint-disable-next-line no-console
      if (searchResult.length > 0) {
        callback(formatSuggestions(searchResult));
      }
      return;

      function formatSuggestions(results: SQLiteResult[]): Suggestion[] {
        return results.map(
          (row): Suggestion => {
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
          }
        );
      }
    };
  }

  private static getEmptyTemplate() {
    return (args: Hogan.Context) => Hogan.compile(templates.empty).render(args);
  }

  private static getSuggestionTemplate(isSimpleLayout: boolean) {
    const stringTemplate = isSimpleLayout
      ? templates.suggestionSimple
      : templates.suggestion;
    const template = Hogan.compile(stringTemplate);
    return (suggestion: Hogan.Context) => template.render(suggestion);
  }

  private handleSelected(
    input: any,
    _event: any,
    suggestion: Suggestion,
    _datasetNumber: any,
    context: any = {}
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

  private handleShown(input: JQuery<HTMLElement>) {
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

export default BlogSearch;
