import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

type PackageManifest = {
  engines?: { node?: string };
  dependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  pnpm?: { overrides?: Record<string, string> };
};

const manifest = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as PackageManifest;
const nvmrc = readFileSync(new URL("../.nvmrc", import.meta.url), "utf8").trim();

test("declares the Node 22 security runtime and direct dependency baseline", () => {
  assert.equal(nvmrc, "22.18.0");
  assert.equal(manifest.engines?.node, ">=22 <23");
  assert.equal(manifest.dependencies?.axios, undefined);
  assert.match(manifest.dependencies?.next ?? "", /^\^16\.3\./);
  assert.match(manifest.dependencies?.["firebase-admin"] ?? "", /^\^14\./);
  assert.equal(manifest.dependencies?.tailwindcss, "^3.4.19");
  assert.equal(manifest.pnpm?.overrides?.immutable, ">=4.3.8");
});

test("uses project-pinned tsx runners without pnpm dlx", () => {
  const securityScript = manifest.scripts?.["test:security"] ?? "";
  const notionScript = manifest.scripts?.["test:notion"] ?? "";

  for (const script of [securityScript, notionScript]) {
    assert.match(script, /^pnpm exec tsx(?:\s|$)/);
    assert.doesNotMatch(script, /(?:^|\s)pnpm dlx(?:\s|$)/);
  }

  assert.match(
    notionScript,
    /(?:^|\s)--conditions(?:=|\s+)react-server(?:\s|$)/,
  );
});
