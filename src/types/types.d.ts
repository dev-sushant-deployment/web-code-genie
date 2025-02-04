export type FileSystem = {
  name: string;
  path: string;
  content?: string;
  children: FileSystem[];
}

export type File = {
  name: string;
  path: string;
  content: string;
}

export type Code = {
  title: string;
  updatedAt: Date;
  id: string;
}

export type FileSystemTree = {
  [key: string]: {
    file: {
      content: string;
    }
  }
  |
  {
    directory: FileSystemTree;
  }
}
