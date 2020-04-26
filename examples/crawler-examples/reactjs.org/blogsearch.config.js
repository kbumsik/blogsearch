module.exports = {
  // This must be 'simple'.
  type: 'simple',
  /**
   * Generated blogsearch database file.
   * Note that you might not want to use .db instead of .wasm (or .db.wasm).
   * Setting improper file extension may lead file format corruption.
   * .wasm is recommended because this is a file format that is usually
   * compressed by web servers.
   * Make sure that web servers compress the file extension you choose.
   * (e.g. Content-Encoding: gzip included in the response) 
   */
  output: './reactjs.org.blogsearch.db.wasm',
  /**
   * List of entries to parse. The crawler uses glob pattern internally.
   * How to use glob: https://github.com/isaacs/node-glob
   */
  entries: [
    './reactjs.org/public/docs/**/*.html'
  ],
  /**
   * Field configurations of the database.
   * There are 5 fields you need to configure:
   *  - title
   *  - body
   *  - url
   *  - categories
   *  - tags
   *
   * Options for a field
   *  - weight: number
   *      The weight of matching score during the search operation.
   *      Set 0 if you don't want to search against the field.
   *  - hasContent: boolean
   *      When disabled (by setting false) the content of this field won't
   *      appear in the search field. The data still will be "searchable"
   *      even if hasContent is disabled.
   *      Recommended for disabled to reduce the size of the output database.
   *  - parser:
   *      parser configuration. parser can have the following types:  
   *        - string
   *            This is considered as a CSS selector.
   *        - function (entry, page: puppeteer::page) => string | Promise<string>
   *            This is a generic parser function when a CSS selector is not available.
   *        - false
   *            This can be use if you don't want to parse the field.
   */
  fields: {
    title: {
      weight: 10.0,
      // The value can be a CSS selector.
      parser: 'article > header',
    },
    body: {
      // Set false if you want to reduce the size of the database.
      hasContent: true,
      weight: 1.0,
      // It can be a function as well.
      parser: (entry, page) => {
        // Use puppeteer page object.
        // It's okay to return a promise.
        return page.$eval('article > div > div:first-child', el => el.textContent);
      }
    },
    url: {
      // Set 0 if you don't want to search against the URL string.
      weight: 0,
      parser: (entry, page) => {
        // entry is a string of the path being parsed.
        return entry.replace('./reactjs.org/public', 'https://reactjs.org');
      },
    },
    categories: {
      // This is disabled because the target website doesn't have categories.
      enabled: false,
      // This is a dummy parser. This is unused because the field is disabled.
      parser: () => 'categories-1, categories-2',
    },
    tags: {
      // This is disabled because the target website doesn't have tags.
      enabled: false,
      // This is a dummy parser. This is unused because the field is disabled.
      parser: () => 'tags-1, tags-2',
    },
  }
};
