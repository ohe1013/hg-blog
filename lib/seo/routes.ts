export type CanonicalContentEntry = { pageId?: string };

export type RouteResolution =
  | { kind: "canonical"; pageId: string }
  | { kind: "redirect"; pageId: string }
  | { kind: "not-found" };

const TERMINAL_NOTION_ID =
  /([0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

function normalizedTerminalNotionId(value: string): string | null {
  const match = value.match(TERMINAL_NOTION_ID);
  return match ? match[1].replaceAll("-", "").toLowerCase() : null;
}

export function resolveCanonicalPageId(
  requestedPageId: string,
  entries: readonly CanonicalContentEntry[],
): RouteResolution {
  const canonicalIds = entries.flatMap((entry) =>
    entry.pageId ? [entry.pageId] : [],
  );
  const exact = canonicalIds.find((pageId) => pageId === requestedPageId);
  if (exact) return { kind: "canonical", pageId: exact };

  const normalizedRequested = normalizedTerminalNotionId(requestedPageId);
  if (!normalizedRequested) return { kind: "not-found" };

  const aliasTarget = canonicalIds.find(
    (pageId) => normalizedTerminalNotionId(pageId) === normalizedRequested,
  );
  return aliasTarget
    ? { kind: "redirect", pageId: aliasTarget }
    : { kind: "not-found" };
}
