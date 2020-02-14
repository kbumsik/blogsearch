#!/usr/bin/env node
import * as path from 'path';
import crawlBlog from './index';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require(path.resolve(process.cwd(), 'blogsearch.config.js'));

crawlBlog(config)
  .then(_value => {
    console.log('Parsing complete.');
    process.exit(0);
  }).catch(error => {
    console.error(error);
    console.log('Parsing failed.');
    process.exit(1);
  });
