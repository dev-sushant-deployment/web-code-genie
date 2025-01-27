export const getFileLanguage = (path : string) => {
  const name = path.split("/").slice(-2)[0];
  const extension = name.split(".").pop();
  switch (extension) {
    case "js":
      return "javascript";
    case "jsx":
      return "javascript";
    case "ts":
      return "typescript";
    case "tsx":
      return "typescript";
    case "prisma":
      return "prisma";
    case "css":
      return "css";
    case "html":
      return "html";
    case "json":
      return "json";
    case "md":
      return "markdown";
    case "svg":
      return "xml";
    case "scss":
      return "scss";
    case "sass":
      return "sass";
    case "less":
      return "less";
    case "styl":
      return "stylus";
    case "yaml":
      return "yaml";
    case "yml":
      return "yaml";
    case "graphql":
      return "graphql";
    case "sql":
      return "sql";
    case "java":
      return "java";
    case "c":
      return "c";
    case "cpp":
      return "cpp";
    case "php":
      return "php";
    case "py":
      return "python";
    case "rb":
      return "ruby";
    case "swift":
      return "swift";
    case "go":
      return "go";
    case "rs":
      return "rust";
    case "pl":
      return "perl";
    case "lua":
      return "lua";
    case "sh":
      return "shell";
    case "bash":
      return "shell";
    case "zsh":
      return "shell";
    case "dockerfile":
      return "dockerfile";
    default:
      return "plaintext";
  }
}