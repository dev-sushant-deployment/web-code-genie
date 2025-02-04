"use client"

import { baseConfig } from "@/constants";
import { WebContainer } from "@webcontainer/api";
import { createContext, useContext, useState, ReactNode, useEffect } from "react"

interface CodeContextType {
  prompt: string;
  setPrompt: (prompt: string) => void;
  response: {
    title?: string;
    files: { name: string; path: string; content: string }[];
    response: string;
  };
  setResponse: (response: CodeContextType['response']) => void;
  webContainer: WebContainer | null;
  setWebContainer: (webContainer: WebContainer) => void;
}

const CodeContext = createContext<CodeContextType>({
  prompt: '',
  setPrompt: () => {},
  response: { files: [], response: '' },
  setResponse: () => {},
  webContainer: null,
  setWebContainer: () => {}
})

export function CodeProvider({ children }: { children: ReactNode }) {
  const [prompt, setPrompt] = useState<string>('')
  const [response, setResponse] = useState<CodeContextType['response']>({ files: [], response: '' })
  const [webContainer, setWebContainer] = useState<WebContainer | null>(null)

  useEffect(() => {
    const initializeWebContainer = async () => {
      console.log('booting web container')
      const webContainerInstance = await WebContainer.boot()
      console.log('web container booted')
      // await webContainerInstance.mount(baseConfig)
      setWebContainer(webContainerInstance)
    }
    initializeWebContainer()
  }, [])

  return (
    <CodeContext.Provider value={{ prompt, setPrompt, response, setResponse, webContainer, setWebContainer }}>
      {children}
    </CodeContext.Provider>
  )
}

export const useCode = () => useContext(CodeContext)

