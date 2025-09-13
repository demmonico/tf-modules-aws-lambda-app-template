import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  pluginJs.configs.recommended,
  {
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      'max-len': ['error', { code: 150 }],
      'no-console': 'off',
      'import/extensions': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
    },
    languageOptions: {
      parserOptions: { ecmaVersion: 13 },
      globals: {
        ...globals.node,
      }
    },
  },
  { ignores: ['dist/'] },
];
