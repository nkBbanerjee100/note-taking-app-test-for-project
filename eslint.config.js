import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  {
    ignores: ['dist', 'cypress/videos', 'cypress/screenshots'],
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
        appLogger: true,
        context: true
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
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
      ],
      'no-undef': 'off'
    }
  }
];