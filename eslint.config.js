import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
    { ignores: ["eligibility.js", "node_modules/**"] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["script.js"],
        languageOptions: {
            globals: globals.browser
        },
        rules: {
            // UI functions are called by the existing HTML event handlers.
            "no-unused-vars": "off"
        }
    },
    {
        files: ["eligibility.ts"],
        languageOptions: {
            globals: globals.browser
        }
    }
);
