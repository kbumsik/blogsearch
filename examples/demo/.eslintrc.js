module.exports = {
  extends: [
    '../.eslintrc.js'
  ],
  parserOptions: {
      project: './tsconfig.base.json'
  },
  ignorePatterns: [
    'public/'
  ]
};
