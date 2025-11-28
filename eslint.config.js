
import globals from "globals";
import js from "@eslint/js";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    ignores: [
        "build",
        "dist",
        "coverage",
        ".firebase",
        ".idx",
        "dataconnect-generated",
        "flutter_sdk",
        "android",
        "ios",
        "node_modules",
        "**/node_modules",
        "package-lock.json",
        "**/package-lock.json",
        "yarn.lock",
        "logs",
        "*.log",
        "npm-debug.log*",
        "yarn-debug.log*",
        "yarn-error.log*"
    ]
  },
  js.configs.recommended,
  {
    plugins: {
        "react": eslintPluginReact,
        "react-hooks": eslintPluginReactHooks,
        "prettier": eslintPluginPrettier,
    },
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
            ...globals.jest,
        },
        ecmaVersion: "latest",
        sourceType: "module",
    },
    rules: {
        ...eslintConfigPrettier.rules,
        "prettier/prettier": "warn",
    },
  },
  {
    files: ["frontend/**/*.{js,jsx,ts,tsx}"],
    settings: {
        react: {
            version: "detect",
        },
    },
  }
];
