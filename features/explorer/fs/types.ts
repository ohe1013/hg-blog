export type FileId = string;

export type FsNodeBase = {
  id: FileId;
  name: string;
  parentId?: FileId | null;
};

export type FolderNode = FsNodeBase & {
  kind: "folder";
  children: FileId[];
};

export type FileNode = FsNodeBase & {
  kind: "file";
  mime: string;
  app: string; // 'markdown-viewer' | 'image-viewer' | ...
  payload?: unknown; // 파일 데이터/경로 등
};

export type FsNode = FolderNode | FileNode;

export type FileSystem = {
  rootId: FileId;
  byId: Record<FileId, FsNode>;
};
