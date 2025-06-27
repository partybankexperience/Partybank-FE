import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsEslint from 'typescript-eslint';

export default tsEslint.config(
  {
    ignores: ['dist'],
  },
  {
    // Lint only TS/TSX files
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      // browser globals (window, document, etc.)
      globals: globals.browser,
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: js.configs.recommended.plugins.react, // from @eslint/js
      '@typescript-eslint': tsEslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': js.configs.recommended.plugins['jsx-a11y'],
      prettier: js.configs.recommended.plugins.prettier,
    },
    extends: [
      js.configs.recommended, // ESLint core rules
      'plugin:react/recommended', // react rules
      'plugin:react-hooks/recommended', // hook rules
      'plugin:jsx-a11y/recommended', // accessibility
      'plugin:@typescript-eslint/recommended', // TS rules
      'plugin:prettier/recommended', // prettier integration
      'prettier', // disable conflicting rules
    ],
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // carry over react-refresh rule
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // your overrides:
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // any other tweaks:
      'react/prop-types': 'off', // if you’re using TS for props
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'all',
          printWidth: 100,
          semi: true,
        },
      ],
    },
  },
);
