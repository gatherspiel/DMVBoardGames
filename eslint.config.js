import { defineConfig, globalIgnores } from "eslint/config";

import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
  globalIgnores(["src/beta","src/shared/highlightjs","src/lib/places-js-latest.js"]),
  { files: ["**/*.js"], languageOptions: { globals: globals.browser } },
  { files: ["**/*.js"], plugins: { js }, extends: ["js/recommended"] },

  {
    rules: {
      "sort-imports": "error",
    },
  },
]);
