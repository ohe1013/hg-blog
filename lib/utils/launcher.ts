import { EXTERNAL_LINKS } from "@features/explorer/data";
import { FileNode } from "@features/fs/types";

export type LaunchResult =
  | { ok: true; message?: string }
  | {
      ok: false;
      code: "UNKNOWN_TARGET" | "INVALID_NODE" | "MISSING_URL";
      message: string;
    };

export type OpenAppFn = (
  app: string,
  params?: Record<string, unknown>,
) => string;

export type LaunchContext = {
  open: OpenAppFn;
};

type DesktopAppMeta = {
  externalUrl?: string;
};

type ResolvedTarget =
  | { kind: "app"; app: string; params?: Record<string, unknown> }
  | { kind: "external"; url: string };

const RUN_ALIAS_MAP: Record<string, ResolvedTarget> = {
  articles: { kind: "app", app: "articles" },
  about: { kind: "app", app: "about" },
  guestbook: { kind: "app", app: "guestbook" },
  contact: { kind: "app", app: "contact" },
  notepad: { kind: "app", app: "notepad" },
  cmd: { kind: "app", app: "dos-prompt" },
  run: { kind: "app", app: "run-dialog" },
  recyclebin: { kind: "app", app: "recycle-bin" },
  "recycle-bin": { kind: "app", app: "recycle-bin" },
  computer: { kind: "app", app: "computer" },
  document: { kind: "app", app: "document" },
  readme: { kind: "app", app: "notepad", params: { fileId: "readme" } },
  github: { kind: "external", url: EXTERNAL_LINKS.github },
  linkedin: { kind: "external", url: EXTERNAL_LINKS.linkedIn },
};

const unknownTarget = (target: string): LaunchResult => ({
  ok: false,
  code: "UNKNOWN_TARGET",
  message: `'${target}' is not recognized as an internal or external command.`,
});

export const toSafeHttpUrl = (value: unknown): string | null => {
  if (typeof value !== "string") return null;

  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
};

const executeResolvedTarget = (
  resolved: ResolvedTarget,
  ctx: LaunchContext,
): LaunchResult => {
  if (resolved.kind === "external") {
    const safeUrl = toSafeHttpUrl(resolved.url);
    if (!safeUrl) {
      return {
        ok: false,
        code: "MISSING_URL",
        message: "Invalid or missing external URL.",
      };
    }
    ctx.open("external-link-confirm", { url: safeUrl });
    return { ok: true };
  }

  ctx.open(resolved.app, resolved.params);
  return { ok: true };
};

export const normalizeRunCommand = (input: string): string =>
  input.trim().replace(/\s+/g, " ").toLowerCase();

export const launchTarget = (
  rawTarget: string,
  ctx: LaunchContext,
): LaunchResult => {
  const normalized = normalizeRunCommand(rawTarget);
  if (!normalized) {
    return unknownTarget(rawTarget);
  }

  const alias = normalized.split(" ")[0];
  const resolved = RUN_ALIAS_MAP[alias];
  if (!resolved) {
    return unknownTarget(alias);
  }

  return executeResolvedTarget(resolved, ctx);
};

export const launchDesktopAppKey = (
  appKey: string,
  appMeta: DesktopAppMeta | undefined,
  ctx: LaunchContext,
): LaunchResult => {
  if (appKey === "readme") {
    return executeResolvedTarget(
      { kind: "app", app: "notepad", params: { fileId: "readme" } },
      ctx,
    );
  }

  if (appMeta?.externalUrl) {
    return executeResolvedTarget(
      { kind: "external", url: appMeta.externalUrl },
      ctx,
    );
  }

  return executeResolvedTarget({ kind: "app", app: appKey }, ctx);
};

type PayloadWithUrl = {
  url?: string;
};

const isPayloadWithUrl = (payload: unknown): payload is PayloadWithUrl => {
  if (!payload || typeof payload !== "object") return false;
  return "url" in payload;
};

export const launchFileNode = (
  node: FileNode,
  fileId: string,
  ctx: LaunchContext,
): LaunchResult => {
  if (!node.app) {
    return {
      ok: false,
      code: "INVALID_NODE",
      message: "This file node is missing app metadata.",
    };
  }

  if (node.app === "notepad") {
    return executeResolvedTarget(
      { kind: "app", app: "notepad", params: { fileId } },
      ctx,
    );
  }

  if (node.app === "article-viewer") {
    return executeResolvedTarget(
      { kind: "app", app: "article-viewer", params: { fileId } },
      ctx,
    );
  }

  if (node.app === "external-link-confirm") {
    if (!isPayloadWithUrl(node.payload) || !node.payload.url) {
      return {
        ok: false,
        code: "MISSING_URL",
        message: "External link payload is missing url.",
      };
    }

    return executeResolvedTarget(
      { kind: "external", url: node.payload.url },
      ctx,
    );
  }

  return executeResolvedTarget({ kind: "app", app: node.app }, ctx);
};
