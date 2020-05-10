// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-commonjs */
const join = require('path').join;

module.exports = {
  entry: './index.js',
  devtool: 'source-map',
  mode: 'development',
  output: {
    path: join(__dirname, 'public'),
    filename: 'webpack-index.js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: new RegExp('blogsearch/lib/worker.js'),
        type: 'javascript/auto',
        loader: 'worker-loader',
        options: {
          name: 'webpack-[name].[ext]',
        },
      },
      {
        test: new RegExp('blogsearch/dist/blogsearch.wasm'),
        type: 'javascript/auto',
        loader: 'file-loader',
        options: {
          name: 'webpack-[name].[ext]',
        },
      },
      {
        test: /\.(js|jsx|ts|tsx|mjs)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  devServer: {
    contentBase: [`${__dirname}/public`],
    compress: true,
    host: '0.0.0.0',
    port: 9000,
    https: true,
    index: 'index.html',
    overlay: {
      warnings: true,
      errors: true,
    },
    watchOptions: {
      poll: false,
    },
  },
};
