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
  output: './kubernetes.io.crawler-example.db.wasm',
  /**
   * List of entries to parse. The crawler uses glob pattern internally.
   * How to use glob: https://github.com/isaacs/node-glob
   */
  entries: [
    './kubernetes.io/public/docs/!(test|home|sitemap|search)/*/*/index.html',
    './kubernetes.io/public/blog/!(page)/**/*.html',
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
   *  - indexed: boolean
   *      Set if the field is indexed or not.
   *  - hasContent: boolean
   *      When disabled (set as false) the content of the field won't
   *      appear in the search result. The data still will be indexed
   *      even if hasContent is disabled.
   *      Recommended to be disabled to reduce the size of the output size.
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
      parser: (entry, page) => {
        if (entry.includes('public/docs')) {
          return page.$eval('#docsContent > h1', el => el.textContent);
        } else if (entry.includes('public/blog')) {
          return page.$eval('.post-title', el => el.textContent);
        }
      }
    },
    body: {
      // Set false if you want to reduce the size of the database.
      hasContent: true,
      // It can be a async function as well.
      parser: async (entry, page) => {
        // Use puppeteer page object.
        // It's okay to return a promise.
        if (entry.includes('public/docs')) {
          return (await page.$$eval(
            '#docsContent > *',
            els => els.slice(els.findIndex(el => el.tagName.toLowerCase() === 'h1') + 1,
                             els.findIndex(el => el.textContent.trim().toLowerCase() === 'feedback'))
                      .map(el => el.textContent)
          )).join(' ');
        } else if (entry.includes('public/blog')) {
          return page.$eval('div.blog-content', el => el.textContent);
        }
      }
    },
    url: {
      // By setting this false the search engine won't index the URL.
      indexed: false,
      parser: (entry, page) => {
        // entry is a string of the path being parsed.
        return entry.replace('./kubernetes.io/public', 'https://kubernetes.io');
      },
    },
    categories: {
      enabled: true,
      parser: (entry, page) => {
        if (entry.includes('public/docs')) {
          return 'Documentation';
        } else if (entry.includes('public/blog')) {
          return 'Blog';
        }
      },
    },
    tags: {
      // This is disabled because the target website doesn't have tags.
      enabled: false,
      // This is a dummy parser. This is unused because the field is disabled.
      parser: () => 'tags-1, tags-2',
    },
  }
};
