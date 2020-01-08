import Hogan from 'hogan.js';
// import algoliasearch from 'algoliasearch/lite';
// @ts-ignore
import autocomplete from 'autocomplete.js';
import SQLite, {
  Config as SQLiteConfig,
  Result as SQLiteResult,
} from './SQLite';
import templates from './templates';
import utils from './utils';
import $ from './zepto';
type JQueryElement = any; // This is a temporary type to use with zepto.

interface Suggestion {
  isLvl0: boolean;
  isLvl1: boolean;
  isLvl2: boolean;
  isLvl1EmptyOrDuplicate: boolean;
  isCategoryHeader: boolean;
  isSubCategoryHeader: boolean;
  isTextOrSubcategoryNonEmpty: boolean;
  category: string;
  subcategory: string;
  title: string;
  text: string | null;
  url: string;
}

interface SearchResult {
  hits: Array<Hit | HitWithContent>;
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  exhaustiveNbHits: boolean;
  query: string; // Input query
  params: string; // HTTP GET parameters
  index: string; // Index of the database [TODO] Not used
  processingTimeMS: number;
}

type Level = 'lvl0' | 'lvl1' | 'lvl2' | 'lvl3' | 'lvl4' | 'lvl5' | 'lvl6';

type Hierarchy<T> = Partial<Record<Level, T>>;

interface Hit {
  anchor: string; // This will bee added to the URL with '#'
  content: string | null; // Content of result
  hierarchy: Hierarchy<string | null>;
  url: string;
  objectID: string;
  _highlightResult: {
    [lvl in keyof Hit['hierarchy']]?: HighlightResult;
  } & {
    hierarchy?: {
      [lvl in keyof Hit['hierarchy']]: HighlightResult;
    };
    hierarchy_camel: Array<
      {
        [lvl in keyof Partial<
          Hit['_highlightResult']['hierarchy']
        >]: HighlightResult;
      }
    >;
  };
  // Will be added later during processing
  isSubCategoryHeader?: boolean;
  isCategoryHeader?: boolean;
}

interface HitWithContent extends Hit {
  content: string;
  _snippetResult: {
    // Usually only 'content' property
    [key in keyof Partial<Hit>]: SnippetResult;
  };
  _highlightResult: Hit['_highlightResult'] & {
    content: HighlightResult; // Exists if Hit['content'] is not null
  };
}

interface SnippetResult {
  value: string;
  matchLevel: 'full' | 'none';
}

interface HighlightResult extends SnippetResult {
  fullyHighlighted?: boolean; // Exists when matchLevel === 'full'
  matchedWords: string[];
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
  documentationSearch({
  apiKey,
  indexName,
  inputSelector,
  [ appId ],
  [ algoliaOptions.{hitsPerPage} ]
  [ autocompleteOptions.{hint,debug} ]
})`;

interface Config {
  inputSelector: string;
  debug: boolean;
  autocompleteOptions: {
    debug: boolean;
    hint: boolean;
    autoselect: boolean;
    cssClasses: {
      prefix?: string;
    };
    ariaLabel?: string;
  };
  layout: 'columns' | 'simple';
}

type Args = Config & SQLiteConfig;

class BlogSearch {
  // private indexName: Config['indexName'];
  private input: JQueryElement; // [TODO] A return type of zepto
  private autocompleteOptions: Config['autocompleteOptions'];
  private autocomplete: any; // [TODO] A return type of autocomplete()
  private sqlite: SQLite;

  public constructor({
    wasmPath = '',
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
      wasmPath,
      dbPath,
      inputSelector,
      debug,
      autocompleteOptions,
      layout,
    });

    this.input = BlogSearch.getInputFromSelector(inputSelector);
    const autocompleteOptionsDebug =
      autocompleteOptions && autocompleteOptions.debug
        ? autocompleteOptions.debug
        : false;
    // eslint-disable-next-line no-param-reassign
    autocompleteOptions.debug = debug || autocompleteOptionsDebug;
    this.autocompleteOptions = autocompleteOptions;
    this.autocompleteOptions.cssClasses =
      this.autocompleteOptions.cssClasses || {};
    this.autocompleteOptions.cssClasses.prefix =
      this.autocompleteOptions.cssClasses.prefix || 'ds';
    const inputAriaLabel =
      this.input &&
      typeof this.input.attr === 'function' &&
      this.input.attr('aria-label');
    this.autocompleteOptions.ariaLabel =
      this.autocompleteOptions.ariaLabel || inputAriaLabel || 'search input';

    new SQLite({ wasmPath, dbPath }).load().then(sqlite => {
      this.sqlite = sqlite;
    });

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

    this.autocomplete.on(
      'autocomplete:selected',
      this.handleSelected.bind(null, this.autocomplete.autocomplete)
    );

    this.autocomplete.on(
      'autocomplete:shown',
      this.handleShown.bind(null, this.input)
    );
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
      typeof args.wasmPath !== 'string' || !args.wasmPath ||
      typeof args.dbPath !== 'string' || !args.dbPath ||
      typeof args.inputSelector !== 'string' || !args.inputSelector
      /* eslint-enable prettier/prettier */
    ) {
      throw new Error(usage);
    }

    if (!BlogSearch.getInputFromSelector(args.inputSelector)) {
      throw new Error(
        `Error: No input element in the page matches ${args.inputSelector}`
      );
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
      const data = await this.sqlite.search(query);
      // eslint-disable-next-line no-console
      console.log(data);
      callback(formatSuggestions(data));

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
              text: 'row.body',
              url: row.url,
            };
          }
        );
      }
    };
  }

  // Given a list of hits returned by the API, will reformat them to be used in
  // a Hogan template
  // @ts-ignore
  private static formatHits(receivedHits: SearchResult['hits']): Suggestion[] {
    const clonedHits = utils.deepClone(receivedHits);
    const hits = clonedHits.map(hit => {
      return utils.mergeKeyWithParent(hit, 'hierarchy');
    });

    // Group hits by category / subcategory
    let groupedHits: any = utils.groupBy(hits, 'lvl0');
    // Add lvl
    $.each(groupedHits, (level: Level, collection: typeof hits) => {
      const groupedHitsByLvl1 = utils.groupBy(collection, 'lvl1');
      const flattenedHits = utils.flattenAndFlagFirst(
        groupedHitsByLvl1,
        'isSubCategoryHeader'
      );
      groupedHits[level] = flattenedHits;
    });
    groupedHits = utils.flattenAndFlagFirst(groupedHits, 'isCategoryHeader');
    // Translate hits into smaller objects to be send to the template
    return groupedHits.map((hit: Hit | HitWithContent) => {
      const url = BlogSearch.formatURL(hit);
      const category = utils.getHighlightedValue(hit, 'lvl0');
      const subcategory = utils.getHighlightedValue(hit, 'lvl1') || category;
      const displayTitle = utils
        .compact([
          utils.getHighlightedValue(hit, 'lvl2') || subcategory,
          utils.getHighlightedValue(hit, 'lvl3'),
          utils.getHighlightedValue(hit, 'lvl4'),
          utils.getHighlightedValue(hit, 'lvl5'),
          utils.getHighlightedValue(hit, 'lvl6'),
        ])
        .join(
          '<span class="aa-suggestion-title-separator" aria-hidden="true"> › </span>'
        );
      const text = utils.getSnippetedValue(hit, 'content');
      const isTextOrSubcategoryNonEmpty =
        (subcategory && subcategory !== '') ||
        (displayTitle && displayTitle !== '');
      const isLvl1EmptyOrDuplicate =
        !subcategory || subcategory === '' || subcategory === category;
      const isLvl2 =
        displayTitle && displayTitle !== '' && displayTitle !== subcategory;
      const isLvl1 =
        !isLvl2 &&
        subcategory &&
        subcategory !== '' &&
        subcategory !== category;
      const isLvl0 = !isLvl1 && !isLvl2;

      return {
        isLvl0,
        isLvl1,
        isLvl2,
        isLvl1EmptyOrDuplicate,
        isCategoryHeader: hit.isCategoryHeader,
        isSubCategoryHeader: hit.isSubCategoryHeader,
        isTextOrSubcategoryNonEmpty,
        category,
        subcategory,
        title: displayTitle,
        text,
        url,
      };
    });
  }

  private static formatURL(hit: Hit | HitWithContent) {
    const { url, anchor } = hit;
    if (url) {
      const containsAnchor = url.indexOf('#') !== -1;
      if (containsAnchor) return url;
      else if (anchor) return `${hit.url}#${hit.anchor}`;
      return url;
    } else if (anchor) return `#${hit.anchor}`;
    // eslint-disable-next-line no-console
    console.warn('no anchor nor url for : ', JSON.stringify(hit));
    return null;
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

  private handleShown(input: JQueryElement) {
    const middleOfInput = input.offset().left + input.width() / 2;
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
