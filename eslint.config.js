import js from '@eslint/js';
import globals from 'globals';
import {defineConfig, globalIgnores} from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'cypress/videos', 'cypress/screenshots']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [js.recommended],
    languageOptions: {
      ecmaVersion: 2020,
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
      },
      parserOptions: {
        requireAtTopLevel: true
      }
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