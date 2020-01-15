module.exports = {
  ignorePatterns: [
    'dist/*',
    'lib/*',
  ],
  extends: [
    '../.eslintrc.base.js'
  ],
  overrides: [
    {
      files: ['./src/sqlite/*'],
      rules: {
        'dot-notation': ['off']
      }
    }
  ],
};
