const fs = require('fs');
const path = require('path');
const { Database } = require('blogsearch-crawler/lib/database');
const { defaultFields } = require('blogsearch-crawler/lib/defaultFields');

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = async ({ graphql, reporter }, options) => {
  // Override existing database
  const filename = options.output;
  if (!fs.existsSync(path.dirname(filename))) {
    fs.mkdirSync(path.dirname(filename))
  }
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }

  // Create database
  const db = await Database.create({
    filename,
    columns: defaultFields,
  });

  // Get siteUrl
  const { siteUrl } = (await graphql(`
    {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `)).data.site.siteMetadata;

  // Query for markdown nodes to use in creating pages.
  const result = await graphql(options.query);
  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  // Index contents in the database
  options.normalizer(result, siteUrl)
    .map((node, rowid) => {
      db.insert(rowid, node);
    });

  // End
  db.close();
};
