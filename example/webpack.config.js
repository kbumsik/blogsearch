// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-commonjs */
const join = require('path').join;

module.exports = {
  entry: './index.ts',
  devtool: 'source-map',
  mode: 'development',
  output: {
    path: join(__dirname, 'public'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx|ts|tsx|mjs)$/,
        exclude: [/node_modules/, /blogsearch/],
        use: 'eslint-loader',
      },
      {
        test: /\.wasm$/,
        type: 'javascript/auto',
        loader: 'file-loader',
      },
      {
        test: /\.(js|jsx|ts|tsx|mjs)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  devServer: {
    contentBase: [`${__dirname}/public`, './'],
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
