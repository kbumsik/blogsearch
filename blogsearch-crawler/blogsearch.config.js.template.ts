const template = ` 
module.exports = {
  // [Mandatory] This must be 'simple'.
  type: 'simple',
  // [Mandatory] Generated blogsearch database file.
  output: './my_blog_index.db.wasm',
  // [Mandatory] List of entries to parse. The crawler uses glob pattern internally.
  // How to use glob: https://github.com/isaacs/node-glob
  entries: [
    './reactjs.org/public/docs/**/*.html'
  ],
  // [Mandatory] Fields configurations.
  // See: https://github.com/kbumsik/blogsearch#whats-in-the-index
  fields: {
    title: {
      // The value can be a CSS selector.
      parser: 'article > header',
    },
    body: {
      // Set false if you want to reduce the size of the database.
      hasContent: true,
      // It can be a function as well.
      parser: (entry, page) => {
        // Use puppeteer page object.
        // It's okay to return a promise.
        return page.$eval('article > div > div:first-child', el => el.textContent);
      }
    },
    url: {
      // By setting this false the search engine won't index the URL.
      indexed: false,
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
`

export default template;
