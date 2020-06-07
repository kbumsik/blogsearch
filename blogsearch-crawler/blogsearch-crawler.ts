#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import template from './blogsearch.config.js.template';
import { UncheckedConfig } from './configTypes';
import checkConfig from './checkers';
import crawl from './crawler';

const arg = process.argv[2];
const configFile = arg || 'blogsearch.config.js';
const configPath = path.resolve(process.cwd(), configFile);
if (!fs.existsSync(configPath)) {
  if (arg) {
    console.error(`${configFile} doesn't exist.`);
  } else {
    fs.writeFileSync(configPath, template);
    console.error(`
blogsearch.config.js doesn't exist.
An example blogsearch.config.js is created.
Visit https://github.com/kbumsik/blogsearch/tree/master/blogsearch-crawler
to learn how to configure blogsearch.config.js.
`);
  }
  process.exit(1);
}

crawlBlog(tryImport(configPath))
  .then(_value => {
    console.log('Parsing complete.');
    process.exit(0);
  })
  .catch(error => {
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
    throw new Error(`${error}.
See: https://github.com/kbumsik/blogsearch/tree/master/blogsearch`);
  }
}

function tryImport (configPath: string) {
  try {
    return require(configPath); 
  } catch (error) {
    console.error(error);
    console.error(`Parsing ${configPath} failed. Is it a correct .js file?`);
    process.exit(1);
  }
}
