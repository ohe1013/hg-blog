export type FileId = string;

export type FsNodeBase = {
  id: FileId;
  name: string;
  parentId?: FileId | null;
};

export type FolderNode = FsNodeBase & {
  kind: "folder";
  children: FileId[];
  type: "folder";
  iconUrl: string;
};

export type FileNode = FsNodeBase & {
  kind: "file";
  type: "file" | "image" | "notepad" | "notion" | "external-link";
  app: string; // 'markdown-viewer' | 'image-viewer' | ...
  iconUrl: string;
  payload?: { url: string } | string | { pageId: string; slug: string }; // 파일 데이터/경로 등
  pageId?: string;
};

export type FsNode = FolderNode | FileNode;

export type FileData = Record<FileId, FsNode>;

export type FileSystem = {
  rootIds: FileId[]; // rootId -> rootIds
  byId: FileData;
};
