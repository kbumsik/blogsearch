/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const { Database } = require('blogsearch-crawler/lib/database');

/**
 * You can uncomment the following line to verify that
 * your plugin is being loaded in your site.
 *
 * See: https://www.gatsbyjs.org/docs/creating-a-local-plugin/#developing-a-local-plugin-that-is-outside-your-project
 */

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = async ({ graphql, reporter }, options) => {
  const db = await Database.create({
    filename: 'blogsearch.db.wasm',
    columns: new Map([
      ['title', { hasContent: true, weight: 10.0, parser: false, enabled: true }],
      ['body', { hasContent: true, weight: 1.0, parser: false, enabled: true }],
      ['url', { hasContent: true, weight: 0, parser: false, enabled: true }],
      ['categories', { hasContent: true, weight: 5.0, parser: false, enabled: true }],
      ['tags', { hasContent: true, weight: 5.0, parser: false, enabled: true }],
    ]),
  });

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
  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
            }
            rawMarkdownBody
            # excerpt
            # html
          }
        }
      }
    }
  `)
  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  result.data.allMarkdownRemark.edges
    .map(({ node }) => {
      return {
        title: node.frontmatter.title,
        body: node.rawMarkdownBody
                .replace(/[#`\[\]]+/g, '')
                .replace(/\(.*\)/g, '')
                .replace(/\s+/g, ' '),
        url: siteUrl + node.fields.slug,
        categories: (() => {
          const slug = node.fields.slug;
          return slug ? slug.substring(0, slug.indexOf('/')) : '';
        })(),
        tags: '',
      };
    })
    .map((node, rowid) => {
      db.insert(rowid, node);
    });

  db.close();
};
