module.exports = {
  extends: [
    '../.eslintrc.js'
  ],
  parserOptions: {
      project: [
        './tsconfig.json',
        './tsconfig.test.json'
      ]
  },
  ignorePatterns: [
    'dist/*',
    'lib/*',
    'lib-test/*',
  ],
};
