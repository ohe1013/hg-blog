export type NotionSeoDocument = {
  title: string;
  description: string;
  bodyText: string;
  datePublished?: string;
  dateModified?: string;
};

type NotionBlockLike = {
  type?: string;
  properties?: { title?: unknown };
  created_time?: number;
  last_edited_time?: number;
};

export type SeoFallbacks = {
  title: string;
  description: string | ((title: string) => string);
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function unwrapBlock(entry: unknown): NotionBlockLike | null {
  if (!isRecord(entry) || !isRecord(entry.value)) return null;
  const candidate =
    typeof entry.value.type === "string" ? entry.value : entry.value.value;
  if (!isRecord(candidate) || typeof candidate.type !== "string") return null;
  const properties = isRecord(candidate.properties)
    ? { title: candidate.properties.title }
    : undefined;
  return {
    type: candidate.type,
    ...(properties ? { properties } : {}),
    ...(typeof candidate.created_time === "number"
      ? { created_time: candidate.created_time }
      : {}),
    ...(typeof candidate.last_edited_time === "number"
      ? { last_edited_time: candidate.last_edited_time }
      : {}),
  };
}

export function notionRichTextToPlainText(property: unknown): string {
  if (!Array.isArray(property)) return "";
  return property
    .map((fragment) =>
      Array.isArray(fragment) && typeof fragment[0] === "string"
        ? fragment[0]
        : "",
    )
    .join("");
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function toIsoTimestamp(value: unknown): string | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function extractNotionSeoDocument(
  recordMap: unknown,
  fallbacks: SeoFallbacks,
): NotionSeoDocument {
  const blockRecord =
    isRecord(recordMap) && isRecord(recordMap.block) ? recordMap.block : {};
  const blocks = Object.values(blockRecord)
    .map(unwrapBlock)
    .filter((block): block is NotionBlockLike => Boolean(block));
  const root = blocks.find((block) => block.type === "page");
  const title = normalizeWhitespace(
    notionRichTextToPlainText(root?.properties?.title),
  );
  const bodyText = normalizeWhitespace(
    blocks
      .filter((block) => block !== root)
      .map((block) => notionRichTextToPlainText(block.properties?.title))
      .filter(Boolean)
      .join(" "),
  );
  const resolvedTitle = title || fallbacks.title;
  const fallbackDescription =
    typeof fallbacks.description === "function"
      ? fallbacks.description(resolvedTitle)
      : fallbacks.description;
  const datePublished = toIsoTimestamp(root?.created_time);
  const dateModified = toIsoTimestamp(root?.last_edited_time);

  return {
    title: resolvedTitle,
    description: bodyText.slice(0, 160) || fallbackDescription,
    bodyText,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  };
}
