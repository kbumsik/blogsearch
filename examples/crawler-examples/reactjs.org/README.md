# blogsearch-crawler example for [reactjs.org]

This is a blogsearch-crawler (`blogsearch.config.js`) example on how to build
a blogsearch database for [reactjs.org].

## How to use

1. Build reactjs.org pages. The static pages will be generated in `reactjs.org/public`.

```bash
./build-pages.sh
```

2. Run blogsearch-crawler. Have a look at [blogsearch.config.js] to see how to configure it. blogsearch-crawler will generate `reactjs.org.blogsearch.db.wasm` in this folder.

```bash
yarn blogsearch-crawler
```

3. Move `reactjs.org.blogsearch.db.wasm` to [the demo folder](../../demo) and test it.

[reactjs.org]: https://github.com/reactjs/reactjs.org
[blogsearch.config.js]: ./blogsearch.config.js
