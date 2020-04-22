# BlogSearch demo playground

This is a demo webpage to play around, learn, and test blogsearch.

## Getting started

Run the web server:

```bash
yarn start
```

Then open https://localhost:9000 .

### Learn how to use blogsearch with ES mdoule

See [index.js](./index.js), 
and [./public/blogsearch.webpack.html](./public/blogsearch.webpack.html) to learn
how to integrate blogsearch with your site.

### Learn how to use blogsearch with UMD (or with \<script\> tag)

See [./public/blogsearch.jsdelivr.html](./public/blogsearch.jsdelivr.html) and [./public/blogsearch.umd.html](./public/blogsearch.umd.html) to learn how to integrate blogsearch UMD URL with your site.

We recommand [jsDelivr CDN](https://www.jsdelivr.com/package/npm/blogsearch) for UMD URL.

## How to build database for blogsearch?

See [other examples](/examples) to learn how to build database files.

## Rebuild files (for maintainers & developers)

### Rebuild database (.db.bin) files

The following command will rebuild the database files in the [example directory](/examples),
and then copies them to `public/` directory.

```bash
yarn clean:database
yarn build:database
```

### Rebuild blogsearch files

The following command will rebuild blogsearch in [/blogsearch](/blogsearch),
and then copies files in `/blogsearch/dist` to `public/` directory.

```bash
yarn clean:database
yarn build:database
```

### Rebuild everything

```bash
yarn clean
yarn build
```
