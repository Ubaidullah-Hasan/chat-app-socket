import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["**/node_modules/", ".dist/"],
    languageOptions: {
      globals: {
        ...globals.browser,
        process: "readonly",
      },
    },

    rules: {
      "no-unused-vars": "error", // 2
      "no-unused-expressions": "error",
      "prefer-const": "error",
      "no-console": "warn", //1
      "no-undef": "error",
    },
  },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];