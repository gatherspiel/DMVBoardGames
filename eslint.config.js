import js from '@eslint/js'
import globals from 'globals'

export default eslint.config(
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
