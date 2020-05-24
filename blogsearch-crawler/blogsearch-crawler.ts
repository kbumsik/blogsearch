#!/usr/bin/env node
import * as path from 'path';
import crawlBlog from './index';
import * as fs from 'fs';
import template from './blogsearch.config.js.template';

const configPath = path.resolve(process.cwd(), 'blogsearch.config.js');
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, template);
  console.error(`
blogsearch.config.js doesn't exist.
An example blogsearch.config.js is created.
Visit https://github.com/kbumsik/blogsearch/tree/master/blogsearch-crawler
to learn how to configure blogsearch.config.js.
`);
  process.exit(1);
}

crawlBlog(require(configPath))
  .then(_value => {
    console.log('Parsing complete.');
    process.exit(0);
  }).catch(error => {
    console.error(error);
    console.log('Parsing failed.');
    process.exit(1);
  });
