module.exports = {
  env: {
    browser: true,
    node: true
  },
  rules: {
    "eslint-comments/disable-enable-pair": "off",
  },
  overrides: [
    {
      // JavaScript
      files: ['*.js'],
      extends: [
        'algolia',
      ],
    },
    {
      // TypeScript
      files: ['*.ts'],
      extends: [
        'algolia/typescript'
      ],
      rules: {
        // These does not resolve .ts files. Is it bug?
        "import/extensions": "off",
        "import/no-unresolved": "off",
        // This does not allow "T" as generic type naming, forcing to use unnecessary lengthy "TType" or something.
        "@typescript-eslint/generic-type-naming": "off"
      }
    },
    {
      // Our blogsearch.config.js is for demontrations to users.
      // Therefore we choose making easier to understand for users over correcteness by the formatters.
      files: ['*blogsearch.config.js'],
      rules: {
        "eslint-comments/no-unlimited-disable": "off",
      }
    }
  ],
};
