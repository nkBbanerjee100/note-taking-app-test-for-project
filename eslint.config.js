import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import globals from 'globals';

export default defineConfig({
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
    react: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  rules: {
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^__',
        varsIgnorePattern: '^(?:Cypress|cy|describe|it|beforeEach)$'
      }
    ]
  }
});