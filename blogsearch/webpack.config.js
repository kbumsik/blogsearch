// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-commonjs */
module.exports = {
  entry: {
    blogsearch: './lib/index.js',
  },
  output: {
    library: 'blogsearch',
    libraryExport: 'default',
    libraryTarget: 'umd',
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  mode: 'development',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx|mjs)$/,
        exclude: [/node_modules/, /build/],
        use: 'eslint-loader',
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
