import BlogSearch from './BlogSearch';

async function blogsearch (args: Parameters<typeof BlogSearch.create>[0]) {
  return BlogSearch.create(args);
}

blogsearch.engine = function (args: Parameters<typeof BlogSearch.createEngine>[0]) {
  return BlogSearch.createEngine(args);
}

export default blogsearch;
