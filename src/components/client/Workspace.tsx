"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/input"
import { Button } from "../ui/button";
import { Code, Download, Laptop, Loader, MessageCircle, Sparkles } from "lucide-react";
import { demoChats, demoCodeFiles } from "@/demoData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import type { FileSystem as FileSystemType } from '@/types/types';
import { FileSystem } from "./FileSystem";
import { Editor } from "@monaco-editor/react";
import { getFileLanguage } from "@/helper/fileLanguage";
import { useSearchParams } from "next/navigation";

interface WorkspaceProps {
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

export const Workspace : React.FC<WorkspaceProps> = ({ initialChat, initialCodeFiles }) => {
  // initialChat = demoChats;
  // initialCodeFiles = demoCodeFiles;

  const initialPrompt = useSearchParams().get('prompt');

  if ((!initialChat || !initialCodeFiles) && !initialPrompt) throw new Error('Prompt is required to generate code');

  if (!initialChat && initialPrompt) initialChat = [{
    message: initialPrompt,
    type: 'PROMPT'
  }];

  const [prompt, setPrompt] = useState<string>(initialPrompt || '');
  const [chat, setChat] = useState<{ message: string; type: 'PROMPT' | 'RESPONSE'; }[]>(initialChat || []);
  const [codeFiles, setCodeFiles] = useState<{ name: string; path: string; content?: string; }[]>(initialCodeFiles || []);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [fileSystem, setFileSystem] = useState<FileSystemType | undefined>();

  const addFile = (file : FileSystemType) => {
    const newFile = {
      name: file.name,
      path: file.path,
      content: file.content,
      children: []
    };
    setCodeFiles([...codeFiles, newFile]);
  }

  const updateFile = (file : FileSystemType) => {
    const index = codeFiles?.findIndex((f) => f.path === file.path);
    if (index !== -1) {
      if (codeFiles && index !== undefined && index !== -1) {
        const newFiles = [...codeFiles];
        newFiles[index] = {
          name: file.name,
          path: file.path,
          content: file.content
        };
        setCodeFiles(newFiles);
      }
    }
  }

  useEffect(() => {
    if (codeFiles) {
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
      setFileSystem(fs);
    }
  }, [codeFiles]);

  useEffect(() => {
    console.log("fs", fileSystem);
  }, [fileSystem]);

  useEffect(() => {
    console.log("selectedFile", selectedFile);
  }, [selectedFile]);

  return (
    <div className="w-[90vw] h-[80vh] flex items-center gap-3">
      <div className="w-[30%] h-full border-[1px] border-gray-700 rounded-xl flex flex-col items-center justify-center">
        <div className="flex-grow rounded-t-xl w-full overflow-y-scroll p-4 flex flex-col gap-3">
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
          {chat.slice(-1)[0].type === 'PROMPT' &&
            <div className="w-full flex items-start justify-start gap-3 text-sm font-semibold">
              <div className="p-2 rounded-full bg-white text-black">
                <Sparkles size={24}/>
              </div>
              <p className="w-4/5 p-2 text-white">
                {`Generating code for: ${prompt}`}
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
          <div className="w-1/4 border-r-[1px] border-gray-700">
            <p className="text-white w-full border-b-[1px] border-gray-700 p-2 text-lg font-semibold">Files</p>
            {fileSystem &&
              <FileSystem
                fileSystem={fileSystem}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />}
          </div>
          <div className={`w-3/4 flex flex-col items-start justify-start ${selectedFile ? 'overflow-y-scroll' : ''}`}>
            <p className="text-white w-full border-b-[1px] border-gray-700 p-2 text-lg font-semibold">
              {selectedFile.split('/').slice(-2)[0] || 'Code'}
            </p>
            <div className="w-full flex-grow overflow-y-scroll bg-gray-900 flex items-center justify-center">
              {!selectedFile && <p className="text-white text-2xl font-semibold">Select a file to view code</p>}
              {selectedFile && <Editor
                value={codeFiles?.find((file) => file.path + '/' === selectedFile)?.content}
                // onChange={(code) => handleFileContentChange(code)}
                loading={<Loader size={24} className="animate-spin" color="white"/>}
                language={getFileLanguage(selectedFile)}
                theme="vs-dark"
                className="text-white w-[650px] whitespace-pre-wrap focus:outline-none focus:border-none"
              />}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}