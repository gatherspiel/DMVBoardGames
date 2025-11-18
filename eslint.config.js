import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended],
    files: ['**/*.{js}'],
    languageOptions: {
      ecmaVersion: 2021,
      globals: globals.browser,
    },
  },
)
