import { Monaco } from "@monaco-editor/react";

export const setPrismaLanguage = (monaco: Monaco) => {
  // Register the Prisma language
  monaco.languages.register({ id: "prisma" });

  // Define the Prisma syntax highlighting rules
  monaco.languages.setMonarchTokensProvider("prisma", {
    tokenizer: {
      root: [
        // Keywords
        [/\b(model|datasource|generator|enum|type)\b/, "keyword"],

        // Field attributes
        [/@(id|default|unique|relation|map|updatedAt|db|sequence|index|ignore)/, "annotation"],

        // Block attributes
        [/@(relation|map|id|unique|default|index|ignore)/, "annotation"],

        // Types
        [
          /\b(Int|String|Boolean|DateTime|Float|Decimal|Json|Bytes|BigInt)\b/,
          "type",
        ],

        // Comments
        [/\/\/.*/, "comment"],

        // Strings
        [/"([^"\\]|\\.)*$/, "string.invalid"], // non-terminated string
        [/"/, { token: "string.quote", next: "@string" }],

        // Brackets and braces
        [/[{}()[\]]/, "@brackets"],

        // Numbers
        [/\b\d+(\.\d+)?\b/, "number"],
      ],

      string: [
        [/[^\\"]+/, "string"],
        [/\\./, "string.escape.invalid"],
        [/"/, { token: "string.quote", next: "@pop" }],
      ],
    },
  });

  // Define Prisma-specific configuration
  monaco.languages.setLanguageConfiguration("prisma", {
    comments: {
      lineComment: "//",
    },
    brackets: [["{", "}"], ["[", "]"], ["(", ")"]],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
    ],
  });

  monaco.editor.defineTheme("prisma-dark", {
    base: "vs-dark", // Inherit the default vs-dark theme
    inherit: true,
    rules: [
      { token: "keyword", foreground: "d73a49" }, // Red for keywords
      { token: "type", foreground: "6f42c1" }, // Purple for types
      { token: "annotation", foreground: "0366d6" }, // Blue for annotations
      { token: "comment", foreground: "6a737d", fontStyle: "italic" }, // Gray italic for comments
      { token: "string", foreground: "032f62" }, // Dark blue for strings
      { token: "number", foreground: "005cc5" }, // Blue for numbers
      { token: "brackets", foreground: "d1d5db" }, // Light gray for brackets
    ],
    colors: {
      // Keeping the existing dark theme colors
      "editorLineNumber.foreground": "#6a737d", // Gray for line numbers
    },
  });
  
  
};
