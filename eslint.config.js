import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactRefresh from '@eslint/plugin-react-refresh';
import {defineConfig, globalIgnores} from 'eslint/config';
import globals from 'globals';

export default defineConfig([
    globalIgnores(['dist', 'cypress/videos', 'cypress/screenshots']),
    {
    files: ['**/*.{js,jsx}'],
    extends: [js.recommended, react.configs.flat.recommended, reactRefresh.configs.vite],
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
        'no-unused-vars': [ 'error', {
        argsIgnorePattern: '{\![\}]|$.[\'"].*[\'"]+$',
        varsIgnorePattern: '^(?:Cypress|cy|describe|it|beforeEach)$'
        } ]
    }
]);