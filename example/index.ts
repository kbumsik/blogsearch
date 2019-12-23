import blogsearch from 'blogsearch';

window['blogsearch'] = blogsearch;

window['blogsearch']({
  dbPath: 'reactjs.org.blogsearch.db.bin',
  wasmPath: 'sql-wasm.wasm',
}).then( _ => console.log('Ready'));

// window['blogsearch'].load();
