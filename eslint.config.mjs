import path from 'node:path';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import tseslintPlugin from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import { fileURLToPath } from 'node:url';
import jsxA11y from 'eslint-plugin-jsx-a11y';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['**/build', '**/node_modules/*'],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended'
  ),
  {
    plugins: {
      '@typescript-eslint': tseslintPlugin,
      prettier,
      react,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: path.resolve(__dirname, './tsconfig.json'),
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
    rules: {
      semi: ['error', 'always'],
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],

      // ✅ Sonar-like rules
      // eqeqeq: ['error', 'always'], // avoid == unless intentional
      // curly: ['error', 'all'], // enforce block braces
      'no-console': ['warn', { allow: ['warn', 'error'] }], // allow warn/error only
      'no-empty-function': 'error',
      'no-duplicate-imports': 'error',
      'default-case': 'warn',
      'no-fallthrough': 'error',
      'no-else-return': 'warn',
      'no-implicit-coercion': 'warn',
      'no-useless-return': 'warn',
      'consistent-return': 'warn',
      'no-shadow': 'warn',
      'no-magic-numbers': [
        'warn',
        {
          ignore: [0, 1, -1],
          ignoreArrayIndexes: true,
          enforceConst: true,
          detectObjects: false,
        },
      ],
      'prefer-const': 'error',
      'prefer-template': 'warn',
      'no-unneeded-ternary': 'warn',
      'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      'no-var': 'error',
      'object-shorthand': ['warn', 'always'],
      'no-new-wrappers': 'error',
      'no-eval': 'error',
      'no-alert': 'warn',
      'dot-notation': 'warn',

      // ✅ TS-specific Sonar-like rules
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
    },
  },
];
