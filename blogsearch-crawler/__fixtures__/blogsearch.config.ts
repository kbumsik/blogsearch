import { UncheckedConfig } from '../configTypes';

const configExample: UncheckedConfig = {
  type: 'simple',
  output: './reactjs.org.crawler-example.db.wasm',
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
   *  - indexed: boolean
   *      Set if the field is indexed or not.
   *  - hasContent: boolean
   *      When disabled (set as false) the content of the field won't
   *      appear in the search result. The data still will be indexed
   *      even if hasContent is disabled.
   *      Recommended to be disabled to reduce the size of the output size,
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
      // The value can be a CSS selector.
      parser: 'article > header',
    },
    body: {
      hasContent: false,
      // It can be a function as well.
      parser: (entry, page) => {
        // Use puppeteer page object.
        return page.$eval('article > div > div:first-child', el => el.textContent); // It's okay to return a promise.
      }
    },
    url: {
      indexed: false,
      parser: (entry, page) => {
        // entry is a string of the path being parsed.
        return entry.replace('./reactjs.org/public', 'https://my_own_blog_website');
      }
    },
    categories: {
      parser: false,
      indexed: false
    },
    tags: {
      enabled: false,
      indexed: false
    },
  }
};

module.exports = configExample;
