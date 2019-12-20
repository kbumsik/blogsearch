/* eslint-disable */
module.exports = {
  output: './reactjs.org.blogsearch.db.bin',
  inputs: [
    {
      /**
       * 'generic' is the only type supported now.
       * Types like 'jekyll', or 'gatsby' will be supported in the future.
       */
      type: 'generic',
      /**
       * List of entries to parse. The crawler uses glob package internally.
       */
      entries: [
        './reactjs.org/public/docs/**/*.html'
      ],
      /**
       * The crawler uses this to parse for the fields
       * Each field can have two types:
       *  - string
       *      This is considered as a CSS selector.
       *  - function (entry, page: puppeteer::page) => string | Promise<string>
       *      This is a generic parser function when a CSS selector is not available.
       */
      fieldsParser: {
        // The value can be a CSS selector.
        title: 'article > header',
        // It can be a function as well.
        body: (entry, page) => {
          return page.$eval('article > div > div:first-child', el => el.textContent); // It's okay to return a promise.
        },
        url: (entry, page) => entry.replace('./reactjs.org/public', 'https://my_own_blog_website')
      }
    }
  ],
  /**
   * Field configurations of the database. Each fields is a column of the database.
   * The below an example, of course, you can add more fields as you need.
   *
   * Options for a field
   *  - searchable: boolean (default: true)
   *      This enables full-text indexing. If enabled, search() in
   *      the browser will be search against the field.
   *      Recommended for disabled if the field is something like URL,
   *      which is not intended to be looked up.
   *  - noContent: boolean (default: false)
   *      When enabled the database does not store the field's data.
   *      It still will be "searchable" even if noContent is enabled.
   *      Recommended for enabled if the field is the body of the content,
   *  - weight: number (default: 1.0)
   *      The weight of matching score during the search() operation.
   */
  fields: {
    title: { searchable: true, noContent: false, weight: 10.0 },
    body: { searchable: true, noContent: true, weight: 1.0 },
    url: { searchable: false, noContent: false }
  }
};
