"use client";

import { useState } from "react";
import { Input } from "../ui/input"
import { Button } from "../ui/button";
import { Code, Download, Laptop, MessageCircle, Sparkles } from "lucide-react";
import { demoChats } from "@/demoData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface WorkspaceProps {
  chat: {
    message: string;
    type: 'PROMPT' | 'RESPONSE';
  }[];
}

export const Workspace : React.FC<WorkspaceProps> = ({ chat }) => {
  chat = demoChats;
  const [prompt, setPrompt] = useState<string>('');
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
          className="w-full flex flex-grow rounded-b-xl m-0"
        >
          <div className="w-1/4 border-r-[1px] border-gray-700">
            <p className="text-white w-full border-b-[1px] border-gray-700 p-2 text-lg font-semibold">Files</p>
          </div>
          <div className="w-3/4">
            <p className="text-white w-full border-b-[1px] border-gray-700 p-2 text-lg font-semibold">Codes</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}