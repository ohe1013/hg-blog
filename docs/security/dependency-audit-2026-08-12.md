# Dependency audit — 2026-08-12

This disposition uses the user-run pnpm audit snapshots in `.superpowers/sdd/2026-08-12-dependency-security-remediation/pnpm-audit-after-task2.json` and `pnpm-audit-after-task3.json` as the audit authority. The first snapshot contained 40 advisory records across 41 findings. After the compatible overrides were installed, the second snapshot contained one advisory across two findings: `uuid` advisory 1119441.

## Commands

- `pnpm audit --json`
- `pnpm why <remaining-package>`
- `pnpm why minimatch fast-xml-parser flatted brace-expansion picomatch yaml protobufjs @protobufjs/utf8 @tootallnate/once @grpc/grpc-js form-data websocket-driver immutable uuid` (executed as individual `pnpm why` commands)
- `pnpm install --frozen-lockfile --offline`

The live audit endpoint was not reachable from the sandbox, so the two supplied JSON files are the source of truth. The final frozen offline install succeeded with pnpm 10.14.0.

## Direct roots remediated

| Root | Before | After | Result |
| --- | --- | --- | --- |
| axios | 1.13.5 | removed | removed with unused dependency subtree |
| next | 16.1.6 | 16.3.0 | updated within major 16 |
| firebase-admin | 13.6.1 | 14.2.0 | updated with Node 22 runtime |

## Resolved transitive advisories

The rows below group the 39 advisory records absent from the final audit. Thirteen Task 3 override rules account for 38 of those records. The remaining YAML record disappeared when pnpm regenerated the optional-peer graph; no YAML override is retained and no causal override claim is made for that removal.

| Package and prior advisories | Prior resolved path/version | Compatible override or graph change | Disposition |
| --- | --- | --- | --- |
| `minimatch` — 1113545 / GHSA-7r86-cg39-jmmj; 1113553 / GHSA-23c5-xmqv-rm74 | `@typescript-eslint/... > typescript-estree > minimatch@10.2.2` | `minimatch@>=10.0.0 <10.2.3 -> 10.2.3`; current `pnpm why` reports 10.2.3 | fixed by override; 2 high records removed |
| `fast-xml-parser` — 1114153 / GHSA-fj3w-jwp8-x2g3; 1115339 / GHSA-8gc5-j5rx-235r; 1116307 / GHSA-jp2q-39xq-3w4g; 1117911 / GHSA-gh4j-gqv2-49f6 | `firebase-admin > @google-cloud/storage > fast-xml-parser@5.3.7` | `fast-xml-parser@>=5.0.0 <5.7.0 -> 5.7.0`; current path reports 5.7.0 | fixed by override; 4 records removed (1 low, 2 moderate, 1 high) |
| `flatted` — 1114526 / GHSA-25h7-pfq9-p65f; 1115357 / GHSA-rf6f-7fwh-wjgh | `eslint > file-entry-cache > flat-cache > flatted@3.3.3` | `flatted@>=3.0.0 <3.4.2 -> 3.4.2`; current path reports 3.4.2 | fixed by override; 2 high records removed |
| `brace-expansion` — 1115543 / GHSA-f886-m6hf-6m8v; 1120311 / GHSA-jxxr-4gwj-5jf2; 1123898 / GHSA-3jxr-9vmj-r5cp; 1130591 / GHSA-mh99-v99m-4gvg; 1130734 / GHSA-rgw5-rvv9-x895 | `@typescript-eslint/... > minimatch@10.2.2 > brace-expansion@5.0.3` | `brace-expansion@>=5.0.0 <5.0.9 -> 5.0.9`; current audited branch reports 5.0.9; unrelated minimatch 9 branch remains on safe 2.1.4 | fixed by evidence-bounded 5.x override; 5 records removed (2 moderate, 3 high) |
| `picomatch` — 1115549 and 1115551 / GHSA-3v7f-55p6-f55p; 1115552 and 1115554 / GHSA-c2c7-rcm5-vvqj | Tailwind/chokidar/anymatch path at 2.3.1 and TypeScript-ESLint/tinyglobby path at 4.0.3 | `picomatch@>=2.0.0 <2.3.2 -> 2.3.2` and `picomatch@>=4.0.0 <4.0.4 -> 4.0.4`; current paths report 2.3.2, 4.0.4, and unaffected safe 4.0.5 | fixed by two major-specific overrides; 4 records removed (2 moderate, 2 high); Tailwind remains 3.4.19 |
| `yaml` — 1115556 / GHSA-48c2-rrv3-qjmp | `tailwindcss > postcss-load-config > yaml@2.4.3` optional peer path | No YAML override is retained. After offline pnpm regeneration, `pnpm why yaml` reports no installed path and the lockfile contains no YAML package entry. | removed with the optional YAML peer path during graph regeneration; 1 moderate record removed; causality is not attributed to an override |
| `protobufjs` — 1117571 / GHSA-xq3m-2v4x-88gg; 1118641 / GHSA-66ff-xgx4-vchm; 1118924 / GHSA-2pr8-phx7-x9h3; 1118926 / GHSA-fx83-v9x8-x52w; 1118928 / GHSA-75px-5xx7-5xc7; 1118930 / GHSA-jvwf-75h9-cwgg; 1118932 / GHSA-685m-2w69-288q; 1118935 / GHSA-q6x5-8v7m-xcrf; 1119378 / GHSA-jggg-4jg4-v7c6; 1123488 / GHSA-wcpc-wj8m-hjx6; 1123492 / GHSA-f38q-mgvj-vph7; 1123964 / GHSA-j3f2-48v5-ccww | `firebase-admin > @google-cloud/firestore > protobufjs@7.5.4` and its compatible google-gax/proto-loader/serializer branches | `protobufjs@>=7.0.0 <7.6.5 -> 7.6.5`; all current branches report 7.6.5 | fixed by override; 12 records removed (1 critical, 6 moderate, 5 high) |
| `@protobufjs/utf8` — 1118933 / GHSA-q6x5-8v7m-xcrf | `... > protobufjs@7.5.4 > @protobufjs/utf8@1.1.0` | `@protobufjs/utf8@<=1.1.0 -> 1.1.1`; all current protobufjs branches report 1.1.1 | fixed by audited vulnerable-range override; 1 moderate record removed |
| `@tootallnate/once` — 1119438 / GHSA-vpq2-c234-7xj6 | `firebase-admin > @google-cloud/storage > teeny-request > http-proxy-agent > @tootallnate/once@2.0.0` | `@tootallnate/once@>=2.0.0 <2.0.1 -> 2.0.1`; current branches report 2.0.1 | fixed by override; 1 low record removed |
| `@grpc/grpc-js` — 1120582 / GHSA-5375-pq7m-f5r2; 1120588 / GHSA-99f4-grh7-6pcq | `firebase-admin > @google-cloud/firestore > google-gax > @grpc/grpc-js@1.14.3` | `@grpc/grpc-js@>=1.14.0 <1.14.4 -> 1.14.4`; current path reports 1.14.4 | fixed by override; 2 high records removed |
| `form-data` — 1120745 / GHSA-hmw2-7cc7-3qxx | `firebase-admin > @google-cloud/storage > retry-request > @types/request > form-data@2.5.5` | `form-data@>=2.0.0 <2.5.6 -> 2.5.6`; current path reports 2.5.6 | fixed by override; 1 high record removed |
| `websocket-driver` — 1123482 / GHSA-mp7j-qc5w-4988; 1123483 / GHSA-xv26-6w52-cph6 | `firebase-admin > @firebase/database-compat > @firebase/database > faye-websocket > websocket-driver@0.7.4` | `websocket-driver@>=0.5.0 <0.7.5 -> 0.7.5`; current path reports 0.7.5 | fixed by override; 2 records removed (1 moderate, 1 critical) |
| `immutable` — 1124007 / GHSA-v56q-mh7h-f735; 1124017 / GHSA-xvcm-6775-5m9r | `sass@1.102.0 > immutable@5.1.5` | `immutable@>=5.0.0-beta.1 <5.1.8 -> 5.1.8`; current path reports 5.1.8; existing `immutable: ">=4.3.8"` override is retained | fixed by range-specific override; 2 high records removed |

Together these grouped rows account for exactly 39 prior advisory records: 38 fixed by 13 evidence-bounded Task 3 override rules and one removed with the optional YAML path during graph regeneration. The post-change audit reports none of their package names.

## Remaining advisories

| Advisory/package | Resolved dependency path | Fixed version availability | Disposition |
| --- | --- | --- | --- |
| 1119441 / GHSA-w5hq-g745-h8pq — `uuid` (moderate; two findings) | Audit paths: `firebase-admin@14.2.0 > @google-cloud/storage@7.19.0 > gaxios@6.7.1 > uuid@9.0.1` and `firebase-admin@14.2.0 > @google-cloud/storage@7.19.0 > uuid@8.3.2`. `pnpm why uuid` also expands the 9.0.1 resolution through Google Auth/gcp-metadata/gtoken and retry-request/teeny-request branches. | Patched only in `uuid >=11.1.1`. Storage declares `uuid ^8.0.0`; gaxios 6.7.1 declares `^9.0.1`; teeny-request 9.0.0 declares `^9.0.0`. Version 11.1.1 violates each consumer's declared major range. | **no safe upstream fix in the current dependency ranges**. No override applied. Requires compatible upstream releases of the Firebase Admin / Google Cloud Storage subtree before remediation; forcing uuid 11 would be an unproven major-version substitution. |

The final audit metadata is 0 critical, 0 high, 2 moderate, and 0 low across 522 total dependencies. The two moderate counts are the two resolved paths for the single remaining `uuid` advisory; they are not two distinct advisories.

## Verification evidence

- `pnpm lint`: exit 0.
- `pnpm test:security`: exit 0; 2/2 dependency-contract subtests passed.
- `node_modules\.bin\tsc.cmd --noEmit --incremental false`: exit 0 with no diagnostics. A prior raw `pnpm exec tsc` attempt failed only because that controller shell did not resolve the project bin; it did not report a TypeScript error.
- `pnpm test:notion`: exit 0; 1/1 integration subtest passed with the project-pinned `tsx` runner.
- Clean `pnpm build`: compilation and TypeScript checking passed, but static generation exited 1 when Notion returned `403 Forbidden` for `/about/88d3fb4a1ab64838a9d755b69d7cb80e`. This external-content failure was not the known Windows Turbopack junction collision, so no webpack build retry was run and it is not classified as a dependency-remediation regression.
- An owned webpack development server returned HTTP 200 and JSON from `/api/comments?articlePageId=2f5145eb576b806db310ffae54659a96&limit=20`; its PID was stopped and TCP 5170 was confirmed clear afterward.

## Deployment handoff

- Vercel project runtime must use Node 22 or later.
- Deploy the commit containing `package.json` and `pnpm-lock.yaml` together.
- After deployment, verify `/api/notion/page/2f5145eb576b806db310ffae54659a96` and the Firebase-backed comments endpoint.

## Fix round 1 final verification - 2026-08-13

- The earlier clean-build Notion 403 is resolved by one shared `lib/server/notion.ts` reader using `https://app.notion.com/api/v3` and the NotionX User-Agent. The API route and both About and Article server pages now use that reader; no default `NotionAPI` construction remains in those consumers.
- TDD evidence: the new focused helper integration test first exited 1 because `../lib/server/notion` did not exist, then passed 1/1 after the helper was implemented.
- `pnpm test:notion` exits 0 with 2/2 integration tests passing. Extending this script is a narrowly justified Task 4 follow-up: it removes the former `pnpm dlx` registry dependency and runs both the preserved route test and new helper test through the existing project-pinned `pnpm exec tsx` runner.
- `pnpm test:security` exits 0 with 2/2 tests passing; `pnpm lint` exits 0; `pnpm exec tsc --noEmit --incremental false` exits 0 with no diagnostics.
- After resolving and removing only `E:\github\hg-blog\.next`, clean `pnpm build` exits 0 under Next.js 16.3.0 Turbopack. Compilation, TypeScript, page-data collection, and 17/17 static pages complete; no webpack fallback is used. Existing Sass `@import` deprecation and stale Browserslist-data warnings remain non-blocking.
- `next-env.d.ts` is an intentionally tracked, Next-generated file documented by `AGENTS.md`, not a newly created Task 4 artifact. The clean build updated its generated type paths; it was not hand-edited.
- The already deployed `cdac1af` history is an external historical commit-boundary limitation and was not rewritten. Fix-round changes remain unstaged for controller review.

## Final fix wave verification - 2026-08-13

- `lib/server/notion.ts` now imports `server-only` before `notion-client`, so Next enforces the shared reader's server boundary. The Notion endpoint base URL and NotionX User-Agent are unchanged.
- The project does not install a top-level `server-only` package. Direct `tsx` resolution therefore produced `ERR_MODULE_NOT_FOUND`; a probe using the same conditional export map as Next's bundled marker confirmed that the default condition throws and `react-server` resolves the empty server entry.
- `test:notion` now runs under `--conditions=react-server` with a test-only tsconfig mapping the marker to Next's bundled empty server entry. This leaves the application tsconfig and Next's client-side enforcement untouched. Both real, unmocked Notion reads pass: the shared helper and API route (2/2).
- The dependency contract now guards Tailwind `^3.4.19`, the generic `immutable` override `>=4.3.8`, both project-pinned `pnpm exec tsx` runners, and the absence of `pnpm dlx`. `pnpm test:security` passes 3/3.
- Final `pnpm lint`, `pnpm exec tsc --noEmit --incremental false`, and the clean bounded `pnpm build` all exit 0. The build compiled, checked TypeScript, and generated 17/17 static pages. Existing Sass `@import` deprecation and stale Browserslist-data warnings remain non-blocking.
- The build did not add to the existing generated `next-env.d.ts` diff; it remains unedited by hand. No dependency, lockfile, Node contract, audit override, Firebase, Tailwind implementation, or Git-state change was made in this wave.
