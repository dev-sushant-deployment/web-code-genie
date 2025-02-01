"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input"
import { Button } from "../ui/button";
import { Code, Download, Laptop, Loader, MessageCircle, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import type { File, FileSystem as FileSystemType } from '@/types/types';
import { FileSystem } from "./FileSystem";
import { Editor, Monaco } from "@monaco-editor/react";
import { getFileLanguage } from "@/helper/Editor/fileLanguage";
import { usePathname, useSearchParams } from "next/navigation";
import { setPrismaLanguage } from "@/helper/Editor/customLanguage";
import { checkAuth } from "./Auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCode } from "@/context/code";
import { createCode } from "@/actions/code";
import { ACCESS_TOKEN_KEY } from "@/constants";

interface WorkspaceProps {
  codeId? : string;
  initialChat?: {
    message: string;
    type: 'PROMPT' | 'RESPONSE';
  }[];
  initialCodeFiles?: {
    name: string;
    path: string;
    content?: string;
  }[];
}

export const Workspace : React.FC<WorkspaceProps> = ({ codeId, initialChat, initialCodeFiles }) => {
  // initialChat = demoChats;
  // initialCodeFiles = demoCodeFiles;

  const initialPrompt = useSearchParams().get('prompt');
  const currentUrl = usePathname();
  const isAuthRoute = currentUrl.includes('/auth');

  if ((!initialChat || !initialCodeFiles) && !initialPrompt && !isAuthRoute) throw new Error('Prompt is required to generate code');

  const router = useRouter();
  const { setResponse, setPrompt: setInitialPrompt } = useCode();

  const [prompt, setPrompt] = useState<string>(initialPrompt || '');
  const [chat, setChat] = useState<{ message: string; type: 'PROMPT' | 'RESPONSE'; }[]>(initialChat || []);
  const [codeFiles, setCodeFiles] = useState<{ name: string; path: string; content?: string; }[]>(initialCodeFiles || []);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [generating, setGenerating] = useState<string>("");
  const [fileSystem, setFileSystem] = useState<FileSystemType>();
  const [title, setTitle] = useState<string>("");
  const chatRef = useRef<HTMLDivElement | null>(null);

  const updateFile = (file : File) => {
    setFileSystem(prev => {
      const path = file.path.split('/');
      let currentDir = prev;

      for (let i = 1; i < path.length; i++) {
        let dir = currentDir?.children?.find((child) => child.name === path[i]);
        if (!dir) {
          dir = {
            name: path[i],
            path: `${currentDir?.path}${path[i]}/`,
            children: []
          };
          currentDir?.children.push(dir);
          currentDir?.children.sort((a, b) => {
            if (a.children.length && !b.children.length) return -1;
            if (!a.children.length && b.children.length) return 1;
            return a.name.localeCompare(b.name);
          });
        }
        currentDir = dir;
      }

      if (currentDir) {
        currentDir.content = file.content;
        setCodeFiles((prevFiles) => {
          const existingFileIndex = prevFiles.findIndex((f) => f.path === file.path);
          if (existingFileIndex !== -1) {
            const updatedFiles = [...prevFiles];
            updatedFiles[existingFileIndex] = file;
            return updatedFiles;
          }
          return [...prevFiles, file];
        });
      }
      return prev;
    })
  }

  const fileSystemToCodeFiles = (fs: FileSystemType) => {
    const files: File[] = [];
    const traverse = (dir: FileSystemType) => {
      if (dir.content) {
        files.push({
          name: dir.name,
          path: dir.path[dir.path.length - 1] === '/' ? dir.path.slice(0, -1) : dir.path,
          content: dir.content
        });
      }
      dir.children?.forEach(traverse);
    }
    traverse(fs);
    return files;
  }

  const generate = async () => {
    if (!prompt) return;
    let url = `/api/generate?prompt=${prompt}`;
    if (chat.length > 1) {
      if (chat.length == 2 && !initialCodeFiles && initialPrompt && fileSystem) {
        setInitialPrompt(initialPrompt);
        setResponse({
          title,
          files: fileSystemToCodeFiles(fileSystem),
          response: chat[1].message
        });
      }
      const loggedin = checkAuth();
      if (!loggedin) {
        toast.info("Login to modify and save your code");
        router.push(`/auth?login=true&signup=false&prompt=${prompt}&intercepted=true`);
        return;
      }
      if (codeId) url = `/api/modify/${codeId}?prompt=${prompt}`;
      else throw new Error('Invalid URL');
    }
    setChat(prev => {
      if (prev.length == 0) return [{ message: prompt, type: 'PROMPT' }];
      if (prev.slice(-1)[0]?.type === 'PROMPT') return prev;
      return [...prev, { message: prompt, type: 'PROMPT' }]
    });
    const eventSource = new EventSource(url);
    console.log("eventSource", eventSource);
    setPrompt("");
    const toastId = toast.loading("Generating Steps...");
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("data", data);
      if (data.title) setTitle(data.title);
      else if (data.name && data.path) {
        setGenerating(data.path);
        toast.loading(`Generating ${data.name}...`, { id: toastId });
        const content = data.content || '';
        updateFile({
          name: data.name,
          path: data.path,
          content
        });
        setSelectedFile(data.path+'/');
      } else if (data.response && !data.done) {
        toast.loading("Generating response...", { id: toastId });
        setChat(prev => {
          if (prev.slice(-1)[0]?.type === 'PROMPT') return [...prev, { message: data.response, type: 'RESPONSE' }];
          prev[prev.length - 1].message = prev[prev.length - 1].message.length > data.response.length ? prev[prev.length - 1].message : data.response;
          return prev;
        })
      } else if (data.done) {
        eventSource.close();
        toast.success("Code generated successfully", { id: toastId});
        setGenerating("");
      }
    }
    eventSource.onerror = (error) => {
      console.log(error);
      eventSource.close();
      toast.error("An error occurred while generating code", { id: toastId });
    }
  }

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

  useEffect(() => {
    if (prompt) generate();
  }, []);

  useEffect(() => {
    if (codeFiles) {
      console.log("codeFiles", codeFiles);
      const fs: FileSystemType = {
        name: 'root',
        path: '/',
        children: []
      };
      codeFiles.forEach((file) => {
        const path = file.path.split('/');
        let currentDir = fs;
        for (let i = 1; i < path.length; i++) {
          const dir = currentDir.children?.find((child) => child.name === path[i]);
          if (dir) {
            currentDir = dir;
          } else {
            const newDir: FileSystemType = {
              name: path[i],
              path: `${currentDir.path}${path[i]}/`,
              children: []
            };
            currentDir.children.push(newDir);
            currentDir.children.sort((a, b) => {
              if (a.children.length && !b.children.length) return -1;
              if (!a.children.length && b.children.length) return 1;
              return a.name.localeCompare(b.name);
            });
            currentDir = newDir;
          }
        }
        currentDir.content = file.content;
      });
      const sortFileSystem = (dir: FileSystemType) => {
        dir.children.sort((a, b) => {
          if (a.children.length && !b.children.length) return -1;
          if (!a.children.length && b.children.length) return 1;
          return a.name.localeCompare(b.name);
        });
        dir.children.forEach(sortFileSystem);
      };
      sortFileSystem(fs);
      if (fs) setFileSystem(fs);
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
    let timeoutId : NodeJS.Timeout;
    if (chat.length == 2 && !initialCodeFiles && initialPrompt) {
      timeoutId = setTimeout(() => {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (token && fileSystem) createCode(token, {
          title,
          files: fileSystemToCodeFiles(fileSystem),
          response: chat[1].message
        }, initialPrompt);
      }, 2000);
    }
    return () => clearTimeout(timeoutId);
  }, [chat]);

  useEffect(() => {
    console.log("fs", fileSystem);
  }, [fileSystem]);

  useEffect(() => {
    console.log("selectedFile", selectedFile);
  }, [selectedFile]);

  return (
    <div className="w-[90vw] h-[80vh] flex items-center gap-3">
      <div className="w-[30%] h-full border-[1px] border-gray-700 rounded-xl flex flex-col items-center justify-center">
        <div
          className="flex-grow rounded-t-xl w-full overflow-y-scroll p-4 flex flex-col gap-3"
          ref={chatRef}
        >
          {chat.map((chatItem, index) => (
            <div key={index} className="w-full flex items-start justify-start gap-3 text-sm font-semibold">
              {chatItem.type === 'PROMPT' ?
                <div className="p-2 rounded-full bg-gray-600 text-white">
                  <MessageCircle size={24}/>
                </div>
                :
                <div className="p-2 rounded-full bg-white text-black">
                  <Sparkles size={24}/>
                </div>
              }
              <p className={`w-4/5 p-2 ${chatItem.type === 'PROMPT' ? 'text-gray-200' : 'text-white'}`}>
                {chatItem.message}
              </p>
            </div>
          ))}
          {chat.length > 0 && chat.slice(-1)[0].type === 'PROMPT' &&
            <div className="w-full flex items-start justify-start gap-3 text-sm font-semibold">
              <div className="p-2 rounded-full bg-white text-black">
                <Sparkles size={24}/>
              </div>
              <p className="w-4/5 p-2 text-white">
                {`Generating code...`}
              </p>
            </div>
          }
        </div>
        <div className="h-12 mt-2 rounded-b-xl w-full flex items-center justify-center sticky bottom-0">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your Imagination here..."
            className="flex-grow placeholder:font-semibold bg-gray-600 text-white placeholder:text-gray-100 rounded-none rounded-es-lg h-full"
          />
          <Button
            onClick={() => generate()}
            className="bg-white text-black hover:bg-gray-200 rounded-none rounded-ee-lg h-full"
          >
            <Sparkles/>
          </Button>
        </div>
      </div>
      <Tabs
        defaultValue="code"
        className="flex-grow h-full border-[1px] border-gray-700 rounded-xl flex flex-col"
      >
        <div className="w-full flex justify-between items-center p-4 border-[1px] border-gray-700 rounded-t-xl">
          <TabsList className="flex gap-3 p-4">
            <TabsTrigger
              value="code"
              className="data-[state=active]:bg-black data-[state=active]:text-white rounded-lg flex justify-center items-center gap-2"
            >
              <Code size={16}/>
              <span>Code</span>
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-black data-[state=active]:text-white rounded-lg flex justify-center items-center gap-2"
            >
              <Laptop size={16}/>
              <span>Preview</span>
            </TabsTrigger>
          </TabsList>
          <Button variant="ghost" className="bg-white text-black hover:bg-gray-200 rounded-lg flex items-center justify-center gap-2">
            <Download/>
            <span>Download Code</span>
          </Button>
        </div>
        <TabsContent
          value="code"
          className={`w-full flex flex-grow rounded-b-xl m-0 ${selectedFile ? 'overflow-y-scroll' : ''}`}
        >
          <div className="w-1/4 border-r-[1px] border-gray-700 overflow-y-scroll relative">
            <p className="text-white w-full border-b-[1px] border-gray-700 p-2 text-lg font-semibold sticky top-0 bg-black z-10">Files</p>
            {fileSystem &&
              <FileSystem
                fileSystem={fileSystem}
                selectedFile={selectedFile}
                generating={generating}
                setSelectedFile={setSelectedFile}
              />}
          </div>
          <div className={`w-3/4 flex flex-col items-start justify-start relative ${selectedFile ? 'overflow-y-scroll' : ''}`}>
            <p className="text-white w-full border-b-[1px] border-gray-700 p-2 text-lg font-semibold sticky top-0">
              {selectedFile.split('/').slice(-2)[0] || 'Code'}
            </p>
            <div className="w-full flex-grow overflow-y-scroll bg-gray-900 flex items-center justify-center">
              {!selectedFile && <p className="text-white text-2xl font-semibold">Select a file to view code</p>}
              {selectedFile && <Editor
                beforeMount={handleEditorWillMount}
                value={codeFiles?.find((file) => file.path + '/' === selectedFile)?.content}
                // onChange={(code) => code && handleEditorChange(code)}
                loading={<Loader size={24} className="animate-spin" color="white"/>}
                language={getFileLanguage(selectedFile)}
                theme="vs-dark"
                options={{
                  wordWrap: "on",
                  formatOnType: true,
                  formatOnPaste: true,
                  minimap: { enabled: true },
                  automaticLayout: true,
                  scrollBeyondLastLine: false
                }}
                className="text-white w-[650px] whitespace-pre-wrap focus:outline-none focus:border-none"
              />}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}