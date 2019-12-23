// eslint-disable-next-line import/no-extraneous-dependencies
import initSearch from 'blogsearch';

initSearch({
  dbPath: 'reactjs.org.blogsearch.db.bin',
  wasmPath: 'sql-wasm.wasm',
}).then(sql => {
  // eslint-disable-next-line dot-notation
  window['blogsearch'] = sql;
});
