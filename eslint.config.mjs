import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends(
        "next/core-web-vitals", // Next.js built-in rules for performance and best practices
        "next/typescript", // Next.js TypeScript-specific lint rules
        "plugin:prettier/recommended", // Enables `eslint-config-prettier` + `eslint-plugin-prettier`
    ),
    ...compat.config({
        extends: ["next", "prettier"],
        rules: {
            "no-console": "warn", // Warning for console.log
            quotes: ["error", "double"], // Enforce double quotes
            "prettier/prettier": "error", // Prettier errors show up in ESLint output
        },
    }),
    {
        ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
    },
];

export default eslintConfig;
