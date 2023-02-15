module.exports = {
  plugins: ['simple-import-sort', 'cypress'],
  extends: ['react-app', 'plugin:cypress/recommended'],
  ignorePatterns: ['./src/wallet-client/**'],
  rules: {
    'prefer-const': 'warn',
    'no-console': 'off',
    'simple-import-sort/imports': 'warn',
    'sort-imports': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports'
      }
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'after-used'
      }
    ],
    'no-restricted-imports': [
      'warn',
      {
        name: 'lodash',
        message:
          "Import the specific methods you need from lodash e.g. `import get from 'lodash/get'`. This helps with bundle sizing."
      }
    ]
  },
}
