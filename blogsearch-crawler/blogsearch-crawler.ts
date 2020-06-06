#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import template from './blogsearch.config.js.template';
import { UncheckedConfig } from './configTypes';
import checkConfig from './checkers';
import crawl from './crawler';

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

// Load configuration
async function crawlBlog (uncheckedConfig: UncheckedConfig) {
  try {
    const config = checkConfig(uncheckedConfig);

    // Override DB file
    if (!fs.existsSync(path.dirname(config.output))) {
      fs.mkdirSync(path.dirname(config.output));
    }
    if (fs.existsSync(config.output)) {
      fs.unlinkSync(config.output);
    }

    await crawl(config);
  } catch (error) {
    // [TODO] Add doc
    throw new Error(`${error}`);
  }
}
