module.exports = [
  // Global ignore patterns
  {
    ignores: ['dist', '.eslintrc.cjs'],
  },

  // Main config for source files
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    // Note: shareable configs (extends) are not supported in flat config.
    // Recommended rules from plugins are intentionally not auto-applied here
    // to keep the flat config simple. You can expand `rules` below or
    // convert to legacy `.eslintrc.cjs` if you prefer using `extends`.
    languageOptions: {
      // Provide browser and ES globals via the `globals` map instead of `env`.
      globals: {
        ...require('globals').browser,
        ...require('globals').es2020,
      },
      parser: require('@typescript-eslint/parser'),
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
