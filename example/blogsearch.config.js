module.exports = {
  type: 'simple',
  output: './reactjs.org.blogsearch.db.bin',
  /**
   * List of entries to parse. The crawler uses glob package internally.
   */
  entries: [
    './reactjs.org/public/docs/**/*.html'
  ],
  /**
   * [TODO] Review and set default fields
   * Field configurations of the database. Each fields is a column of the database.
   * The below an example, of course, you can add more fields as you need.
   *
   * Options for a field
   *  - searchable: boolean
   *      This enables full-text indexing. If enabled, search() in
   *      the browser will be search against the field.
   *      Recommended for disabled if the field is something like URL,
   *      which is not intended to be looked up.
   *  - noContent: boolean
   *      When enabled the content of this field won't appear in the
   *      search field. The data still will be "searchable" even if
   *      noContent is enabled.
   *      Recommended for disabled to reduce the size of the output size,
   *  - weight: number
   *      The weight of matching score during the search() operation.
   */
  fields: {
    // These are mandatory fields
    title: {
      weight: 10.0,
      // The value can be a CSS selector.
      parser: 'article > header',
    },
    body: {
      weight: 1.0,
      // It can be a function as well.
      parser: (entry, page) => {
        // Use puppeteer page object.
        return page.$eval('article > div > div:first-child', el => el.textContent); // It's okay to return a promise.
      }
    },
    url: {
      weight: 0,
      parser: (entry, page) => {
        // entry is a string of the path being parsed.
        return entry.replace('./reactjs.org/public', 'https://my_own_blog_website');
      }
    },
    // Optional fields
    categories: {
      weight: 5.0,
      parser: () => 'categories-1 categories-2',
    },
    tags: {
      enabled: false,
      weight: 5.0,
      parser: () => 'tags-1 tags-2',
    },
  }
};
