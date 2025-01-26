"use client";

import type { FileSystem as FileSystemType } from '@/types/types';
import { File, Folder } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { ArrowAnimate } from './arrowAnimate';

interface FileSystemProps {
  fileSystem: FileSystemType;
  selectedFile: string;
  setSelectedFile: Dispatch<SetStateAction<string>>;
  className?: string;
}

export const FileSystem : React.FC<FileSystemProps> = ({ fileSystem, selectedFile, setSelectedFile, className }) => {
  const [openPaths, setOpenPaths] = useState<string[]>([]);

  const handleClick = ({ path, content }: { path: string, content?: string }) => {
    if (content) setSelectedFile(path);
    else {
      if (openPaths.includes(path)) setOpenPaths(openPaths.filter((tempPath) => tempPath !== path));
      else setOpenPaths([...openPaths, path]);
    }
  }

  return (
    <div className={`w-full flex flex-col items-start justify-center gap-1 pt-1 pl-4 text ${className}`}>
      {fileSystem.children.map(({ name, path, content, children }, index) => {
        return (
          <div key={index} className='w-full pr-1'>
            <div
              onClick={() => handleClick({ path, content })}
              className={`flex items-center justify-start gap-3 cursor-pointer w-full rounded-lg hover:bg-gray-900 p-1 ${selectedFile === path ? 'bg-gray-900' : ''}`}
            >
              {content ?
                <File
                  size={18}
                  color='gray'
                  className='ml-4'
                />
                :
                <div className='flex items-center justify-start gap-px'>
                  <ArrowAnimate open={openPaths.includes(path)} />
                  <Folder
                    size={18}
                    color='gray'
                  />
                </div>
              }
              <span>{name}</span>
            </div>
            {children && 
              <FileSystem
                fileSystem={{ name, path, content, children }}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                className={openPaths.includes(path) ? '' : 'hidden'}
              />}
          </div>
        )
      })}
    </div>
  )
}