import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'indent': ['error', 2, {
        'SwitchCase': 1,
        'VariableDeclarator': 'first',
        'MemberExpression': 1,
        'FunctionDeclaration': {'parameters': 'first'},
        'FunctionExpression': {'parameters': 'first'},
        'CallExpression': {'arguments': 'first'},
        'ArrayExpression': 1,
        'ObjectExpression': 1,
        'ImportDeclaration': 1,
        'flatTernaryExpressions': false
      }],
    },
  },
]
