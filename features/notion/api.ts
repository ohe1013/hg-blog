// @features/notion/api.ts (혹은 별도 파일)

import { initialFs } from "@features/fs/data/initialFs";
import { FileNode } from "@features/fs/types";
export type ArticlePost = FileNode & {
  title: string;
  createdTime: number;
  slug: string;
};

export async function getArticlePosts(): Promise<ArticlePost[]> {
  // FileData -> ArticlePost 배열로 변환
  const articles = initialFs.byId["articles"];
  if (!articles || articles.kind !== "folder") return [];
  const articleIds = articles.children;
  const articleNodes = articleIds.map((id) => initialFs.byId[id]);
  return (
    (
      (Object.values(articleNodes) as FileNode[]).map((a) => ({
        pageId: a.pageId,
        slug: a.pageId, // 지금은 pageId를 slug로 쓰는 구조 유지
        title: a.name, // 이미 사람이 읽을 타이틀이 있음
        type: "notion",
        iconUrl: a.iconUrl,
        createdTime: new Date().getTime(),
        id: a.id,
        name: a.name,
        kind: a.kind,
        parentId: a.parentId,
        app: a.app,
      })) as ArticlePost[]
    )
      // 혹시 pageId가 비어있는 데이터 방어
      .filter((p) => Boolean(p.pageId))
  );
}

export type AboutPost = FileNode & {
  title: string;
  createdTime: number;
  slug: string;
};
export async function getAboutPosts(): Promise<AboutPost[]> {
  // FileData -> ArticlePost 배열로 변환
  const about = initialFs.byId["about"];
  if (!about || about.kind !== "folder") return [];
  const aboutIds = about.children;
  const aboutNodes = aboutIds.map((id) => initialFs.byId[id]);
  return (
    (
      (Object.values(aboutNodes) as FileNode[]).map((a) => ({
        pageId: a.pageId,
        slug: a.pageId, // 지금은 pageId를 slug로 쓰는 구조 유지
        title: a.name, // 이미 사람이 읽을 타이틀이 있음
        type: "notion",
        iconUrl: a.iconUrl,
        createdTime: new Date().getTime(),
        id: a.id,
        name: a.name,
        kind: a.kind,
        parentId: a.parentId,
        app: a.app,
      })) as ArticlePost[]
    )
      // 혹시 pageId가 비어있는 데이터 방어
      .filter((p) => Boolean(p.pageId))
  );
}
