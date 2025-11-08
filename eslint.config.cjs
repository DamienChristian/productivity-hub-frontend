module.exports = [
  // Global ignore patterns
  {
    ignores: ['dist', '.eslintrc.cjs'],
  },

  // Main config for source files
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
      'plugin:jest-dom/recommended',
      'plugin:testing-library/react',
      'prettier',
    ],
    languageOptions: {
      env: { browser: true, es2020: true },
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-refresh': require('eslint-plugin-react-refresh'),
      react: require('eslint-plugin-react'),
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      prettier: require('eslint-plugin-prettier'),
      'jest-dom': require('eslint-plugin-jest-dom'),
      'testing-library': require('eslint-plugin-testing-library'),
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'prettier/prettier': 'error',
    },
  },
];
