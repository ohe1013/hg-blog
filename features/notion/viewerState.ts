export function shouldFetchNotionPage(
  activePageId: string | null,
  loadedPageId: string | null,
): boolean {
  return Boolean(activePageId && activePageId !== loadedPageId);
}

export type NotionViewerRootUrl = "article" | "about";

export function createNotionViewerParams(
  pageId: string,
  initialRecordMap: unknown,
  rootUrl: NotionViewerRootUrl,
) {
  return { pageId, initialRecordMap, rootUrl };
}
