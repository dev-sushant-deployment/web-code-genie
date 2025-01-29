"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface CodeContextType {
  prompt: string;
  setPrompt: (prompt: string) => void;
  response: {
    title?: string;
    files: { name: string; path: string; content: string }[];
    response: string;
  };
  setResponse: (response: CodeContextType['response']) => void;
}

const CodeContext = createContext<CodeContextType>({
  prompt: '',
  setPrompt: () => {},
  response: { files: [], response: '' },
  setResponse: () => {},
})

export function CodeProvider({ children }: { children: ReactNode }) {
  const [prompt, setPrompt] = useState<string>('')
  const [response, setResponse] = useState<CodeContextType['response']>({ files: [], response: '' })

  return (
    <CodeContext.Provider value={{ prompt, setPrompt, response, setResponse }}>
      {children}
    </CodeContext.Provider>
  )
}

export const useCode = () => useContext(CodeContext)

