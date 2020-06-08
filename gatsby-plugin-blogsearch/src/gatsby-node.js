const fs = require('fs');
const path = require('path');
const { Database } = require('blogsearch-crawler/lib/database');
const { checkFields } = require('blogsearch-crawler/lib/checkers');

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = async ({ graphql, reporter }, options) => {
  // Override existing database
  const { output } = options;
  if (!fs.existsSync(path.dirname(output))) {
    fs.mkdirSync(path.dirname(output))
  }
  if (fs.existsSync(output)) {
    fs.unlinkSync(output);
  }

  // Create database
  const db = await Database.create({
    filename: output,
    columns: checkFields(options),
  });

  // Query for markdown nodes to use in creating pages.
  const result = await graphql(options.query);
  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  // Index contents in the database
  options.normalizer(result)
    .map((node, rowid) => {
      db.insert(rowid, node);
    });

  // End
  db.close();
};
