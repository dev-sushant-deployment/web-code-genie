export type FileSystem = {
  name: string;
  path: string;
  content?: string;
  children: FileSystem[];
}
