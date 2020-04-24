# BlogSearch

![Build and Test CI](https://github.com/kbumsik/blogsearch/workflows/Build%20and%20Test%20CI/badge.svg)

[Try it!](https://kbumsik.io/blogsearch/)

A pure client-side full-text search engine for static websites, using WebAssembly.

## Contribution Guide

### Workflow

As blogsearch requires complex toolchains (Emscripten, GNU Make, yarn and etc.)
it is strongly recommended to use Docker for building tasks.

Although this repository is a monorepo where each subprojects has own build scripts,
you can easily run aggregated tasks in the root directory.

Note that our canonical build tool is [GNU Make](./Makefile), not [Node scripts](./package.json).

For NodeJS and Emscripten versions used in thie project, please look at
[the Dockerfile](./Dockerfile).

#### Prepare

```bash
make install-nodue-modules-docker
```

#### Build

```bash
make all-docker   # Or make all, without docker
```

#### Run a demo server

```bash
make start-docker # Or make start, without docker

# You can access the demo page via 0.0.0.0:9000
```

#### Testing

```bash
make test-docker # Or make test, without docker
```

#### Rebuild everything

```bash
make clean

# Then run any commands above
```

## Credits & License

This project is inspired by [DocSearch](https://docsearch.algolia.com/) and is
a reimplementation of it in TypeScript with SQLite backend. (MIT license)

The SQLite backend has a reimplementation of [sql.js](https://github.com/sql-js/sql.js)
in TypeScript. (MIT license)

Other than the above two, the project is MIT License. See [LICENSE](./LICENSE)
