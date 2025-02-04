export const WEBSITE_NAME = 'WebCode Genie';
export const GEMINI_STEPS_GENERATION_MODEL = 'gemini-1.5-flash';
export const GEMINI_CODE_GENERATION_MODEL = 'gemini-1.5-pro';
export const ACCESS_TOKEN_KEY = 'access_token';
// export const baseConfig = {
//   "eslint.config.mjs": {
//     file: {
//       contents: `import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
// ];

// export default eslintConfig;
// `
//     }
//   },
//   "next-env.d.ts": {
//     file: {
//       contents: `/// <reference types="next" />
// /// <reference types="next/image-types/global" />

// // NOTE: This file should not be edited
// // see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
// `
//     }
//   },
//   "next.config.mjs": {
//     file: {
//       contents: `/** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
// `,
//     }
//   },
//   "postcss.config.mjs": {
//     file: {
//       contents: `/** @type {import('postcss-load-config').Config} */
// const config = {
//   plugins: {
//     tailwindcss: {},
//   },
// };

// export default config;
// `
//     }
//   },
//   "tsconfig.json": {
//     file: {
//       contents: `{
//   "compilerOptions": {
//     "target": "ES2017",
//     "lib": ["dom", "dom.iterable", "esnext"],
//     "allowJs": true,
//     "skipLibCheck": true,
//     "strict": true,
//     "noEmit": true,
//     "esModuleInterop": true,
//     "module": "esnext",
//     "moduleResolution": "bundler",
//     "resolveJsonModule": true,
//     "isolatedModules": true,
//     "jsx": "preserve",
//     "incremental": true,
//     "plugins": [
//       {
//         "name": "next"
//       }
//     ],
//     "paths": {
//       "@/*": ["./src/*"]
//     }
//   },
//   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
//   "exclude": ["node_modules"]
// }
// `,
//     }
//   }
// }

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
  },
  ".babelrc": {
    file: {
      contents: `{
  "presets": ["next/babel"]
}`
    }
  },
}