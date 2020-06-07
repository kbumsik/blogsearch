# blogsearch-crawler example for [reactjs.org]

This is a blogsearch-crawler (`blogsearch.config.js`) example on how to build
a blogsearch database for [reactjs.org].

## How to use

1. Build reactjs.org pages. The static pages will be generated in `reactjs.org/public`.

```bash
./build-pages.sh
```

2. Run blogsearch-crawler. Have a look at [blogsearch.config.js] to see how to configure it. blogsearch-crawler will generate `reactjs.org.gatsby-example.db.wasm` in this folder.

```bash
yarn blogsearch-crawler
```

3. Move `reactjs.org.gatsby-example.db.wasm` to [the demo folder](../../demo) and test it.

## How to update the example patches (for maintainers)

1. Go to [./reactjs.org] to edit files.
2. `git add` and `git commit` the editied files.
3. If you want to edit the existing files, use `git rebase --interactive upstream` to rebase. The original branch will always be `upstream`.
4. Go back to this directory and then run `./update-patches.sh`.

[reactjs.org]: https://github.com/reactjs/reactjs.org
[blogsearch.config.js]: ./blogsearch.config.js
