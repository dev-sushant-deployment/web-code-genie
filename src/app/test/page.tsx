"use client";

import { setPrismaLanguage } from "@/helper/Editor/customLanguage";
import { Editor, Monaco } from "@monaco-editor/react"

const TestPage = () => {
  const handleEditorWillMount = (monaco: Monaco) => {
    setPrismaLanguage(monaco);
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React, // Enable React JSX
      allowJs: true,
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      module: monaco.languages.typescript.ModuleKind.ESNext,
    });
    monaco.languages.typescript.typescriptDefaults.addExtraLib(`
      declare namespace JSX {
        interface IntrinsicElements {
          [elemName: string]: any;
        }
      }
    `, 'file:///node_modules/@types/react/index.d.ts');
  };
  return (
  <Editor
    beforeMount={handleEditorWillMount}
    // value={codeFiles?.find((file) => file.path + '/' === selectedFile)?.content}
    value={`
      generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  todos     TodoItem[]
}

model TodoItem {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    Int
  user      User      @relation(fields: [userId], references: [id])
  subtasks  TodoSubtask[]
}

model TodoSubtask {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  todoItemId Int
  todoItem  TodoItem @relation(fields: [todoItemId], references: [id])
}`}
    language="prisma"
    theme="vs-dark"
    options={{
      wordWrap: "on",
      formatOnType: true,
      formatOnPaste: true,
      minimap: { enabled: true },
      automaticLayout: true,
      scrollBeyondLastLine: false
    }}
    className="text-white w-[650px] whitespace-pre-wrap focus:outline-none focus:border-none h-lvh"
  />)
}

export default TestPage;