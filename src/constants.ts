export const WEBSITE_NAME = 'WebCode Genie';
export const GEMINI_STEPS_GENERATION_MODEL = 'gemini-1.5-flash';
export const GEMINI_CODE_GENERATION_MODEL = 'gemini-1.5-pro';
export const ACCESS_TOKEN_KEY = 'access_token';
export const baseConfig = {
  "eslint.config.mjs": {
    file: {
      contents: `import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [...compat.extends("next/core-web-vitals")];

export default eslintConfig;
`
    }
  },
  "postcss.config.js": {
    file: {
      contents: `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
} `
    }
  },
  "jsconfig.json": {
    file: {
      contents: `{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
`
    }
  }
}