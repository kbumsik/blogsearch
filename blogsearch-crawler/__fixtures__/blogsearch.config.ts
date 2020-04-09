import { UncheckedConfig } from '../configTypes';

const configExample: UncheckedConfig = {
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
   *  - weight: number
   *      The weight of matching score during the search() operation.
   *  - hasContent: boolean
   *      When enabled the content of this field won't appear in the
   *      search field. The data still will be "searchable" even if
   *      content is enabled.
   *      Recommended for disabled to reduce the size of the output size,
   */

  /**
   * The crawler uses this to parse for the fields
   * Each field can have three types:
   *  - string
   *      This is considered as a CSS selector.
   *  - function (entry, page: puppeteer::page) => string | Promise<string>
   *      This is a generic parser function when a CSS selector is not available.
   *  - false
   *      This can be use if you don't want to parse the field.
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
    categories: {
      weight: 5.0,
      parser: false,
    },
    tags: {
      weight: 5.0,
      parser: false,
    },
  }
};

module.exports = configExample;
