# BlogSearch

![Build and Test CI](https://github.com/kbumsik/blogsearch/workflows/Build%20and%20Test%20CI/badge.svg)

[Try it!](https://kbumsik.io/blogsearch/)

A pure client-side full-text search engine for static websites, using WebAssembly.

## QnA

#### Why `.db.wasm` is recommended file type for database? It's not a WebAssembly binary file. Why not just `.db`?

It is because we want the database file to get gzip-compressed by the web server.
Popular web services (especially GitHub Pages) usually serve a `.db` file as
an application/octet-stream and do not compress the file. By lying that it is
a WebAssembly binary file `.wasm`, the servers recognize it as application/wasm
and ship it compressed.

Compression is important because it signficantly reduce the size. I saw the size
is reduced up to 1/3.

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
