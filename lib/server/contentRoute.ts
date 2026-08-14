import "server-only";
import { notFound, permanentRedirect } from "next/navigation";
import { getNotionPage } from "./notion";
import {
  extractNotionSeoDocument,
  type NotionSeoDocument,
  type SeoFallbacks,
} from "@lib/seo/notion";
import {
  resolveCanonicalPageId,
  type CanonicalContentEntry,
} from "@lib/seo/routes";

type LoadCanonicalNotionPageInput = {
  requestedPageId: string;
  entries: readonly CanonicalContentEntry[];
  basePath: "/article" | "/about";
  fallbacks: SeoFallbacks;
};

export async function loadCanonicalNotionPage(
  input: LoadCanonicalNotionPageInput,
): Promise<{
  pageId: string;
  recordMap: Awaited<ReturnType<typeof getNotionPage>>;
  seo: NotionSeoDocument;
}> {
  const resolution = resolveCanonicalPageId(
    input.requestedPageId,
    input.entries,
  );
  if (resolution.kind === "not-found") notFound();
  if (resolution.kind === "redirect") {
    permanentRedirect(`${input.basePath}/${resolution.pageId}`);
  }

  const recordMap = await getNotionPage(resolution.pageId);
  return {
    pageId: resolution.pageId,
    recordMap,
    seo: extractNotionSeoDocument(recordMap, input.fallbacks),
  };
}
