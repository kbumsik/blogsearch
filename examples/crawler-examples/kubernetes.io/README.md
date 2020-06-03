# blogsearch-crawler example for [kubernetes.io]

This is a blogsearch-crawler (`blogsearch.config.js`) example on how to build
a blogsearch database for [kubernetes.io].

## How to use

1. Build kubernetes.io pages. The static pages will be generated in `kubernetes.io/public`.

```bash
./build-pages.sh
```

2. Run blogsearch-crawler. Have a look at [blogsearch.config.js] to see how to configure it. blogsearch-crawler will generate `kubernetes.io.crawler-example.db.wasm` in this folder.

```bash
yarn blogsearch-crawler
```

3. Move `kubernetes.io.crawler-example.db.wasm` to [the demo folder](../../demo) and test it.

[kubernetes.io]: https://github.com/kubernetes/website
[blogsearch.config.js]: ./blogsearch.config.js
