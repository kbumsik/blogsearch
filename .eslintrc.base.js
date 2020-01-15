module.exports = {
  extends: [
    'algolia',
  ],
  env: {
    browser: true,
    node: true
  },
  overrides: [
    {
      // TypeScript
      files: ['*.ts'],
      extends: [
        'algolia/typescript'
      ],
      rules: {
        // These does not resolve .ts files. Is it bug?
        'import/extensions': ['off'],
        'import/no-unresolved': ['off'],
        // This does not allow 'T' as generic type naming, forcing to use unnecessary lengthy 'TType' or something.
        '@typescript-eslint/generic-type-naming': ['off'],
        'no-dupe-class-members': ['off'],
        'no-undef': ['off'],
        'valid-jsdoc': ['off'],
        '@typescript-eslint/no-unused-vars': ['off'],
        '@typescript-eslint/no-namespace': ['off'],
        'prettier/prettier': [
          'error',
          {
            trailingComma: 'es5',
            singleQuote: true,
            printWidth: 100,
          },
        ],
      }
    },
    {
      // Our blogsearch.config.js is for demontrations to users.
      // Therefore we choose making easier to understand for users over correcteness by the formatters.
      files: ['*blogsearch.config.js'],
      rules: {
        'eslint-comments/no-unlimited-disable': ['off'],
      }
    }
  ],
};
