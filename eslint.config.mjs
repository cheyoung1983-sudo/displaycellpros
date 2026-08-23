import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([{
    extends: [...nextCoreWebVitals],

    rules: {
        "react/no-unescaped-entities": "off",
        "@next/next/no-html-link-for-pages": "off",
        "@next/next/no-img-element": "off",
        "react-hooks/immutability": "off",
        "react-hooks/purity": "off",
        "react-hooks/set-state-in-effect": "off",
    },
}]);