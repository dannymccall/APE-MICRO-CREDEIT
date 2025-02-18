import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    ...compat.config({
        extends: ["next"],
        rules: {
            // Disable Next.js-specific rules
            'react/no-unescaped-entities': 'off',
            '@next/next/no-page-custom-font': 'off',

            // Disable TypeScript constraints
            // '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/strict-boolean-expressions': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
        },
    }),
];

export default eslintConfig;