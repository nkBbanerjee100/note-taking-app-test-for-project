import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default defineConfig([
  js.configs.recommended,
  {
    root: true,
    ignorePatterns: ['dist', 'cypress/videos', 'cypress/screenshots'],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      }
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        Cypress: true,
        cy: true,
        describe: true,
        it: true,
        beforeEach: true,
        expect: true,
        assert: true,
        require: true,
        appLogger: true
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks
    },
    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^__',
          varsIgnorePattern: '^(?:Cypress|cy|describe|it|beforeEach)$'
        }
      ]
    }
  }
]);