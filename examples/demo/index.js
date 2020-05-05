// eslint-disable-next-line import/no-extraneous-dependencies
import blogsearch from 'blogsearch';
import SearchWorker from 'worker-loader?name=webpack-[name].js!blogsearch/lib/worker';
import SearchWasm from 'blogsearch/dist/blogsearch.wasm';

// eslint-disable-next-line dot-notation

blogsearch({
  workerFactory: () => new SearchWorker(),
  dbPath: '/reactjs.org.crawler-example.db.wasm',
  wasmPath: SearchWasm,
  inputSelector: '#q',
  debug: true, // Set debug to true if you want to inspect the dropdown
});
