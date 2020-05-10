* [ ] Loading without `<script src="https://cdn.jsdelivr.net/npm/blogsearch@0.0.2/dist/worker.umd.js"></script>`

* No highlight when indexing is disabled

```
"CREATE VIRTUAL TABLE blogsearch
      USING fts5(
        title UNINDEXED,body UNINDEXED,url,
        tokenize = 'porter unicode61 remove_diacritics 1',
        content=blogsearch_ext_content,
        content_rowid=rowid
      )"
```