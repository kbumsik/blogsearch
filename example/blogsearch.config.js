const glob = require('glob');

module.exports = {
  output: './reactjs.org.blogsearch.db.bin',
  inputs: [
    {
      // This is the only type supported now.
      type: 'url',
      // List of entries to parse
      // glob will make things easier
      includes: [
        ...glob.sync('./reactjs.org/public/docs/**/*.html', { nodir: true })
      ],
      // CSS selector of each field.
      selectors: {
        title: 'article > header',
        body: 'article > div > div:first-child'
      }
    }
  ],
  // Field configuration of the database
  fields: {
    title: { indexed: true },
    body: { indexed: true }
  },
  /* Make the database contain index only to reduce the size.
     By setting true the database does not contain the contents. */
  contentless: true
};
