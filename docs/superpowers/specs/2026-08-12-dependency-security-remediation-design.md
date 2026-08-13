# Dependency security remediation design

**Date:** 2026-08-12  
**Status:** Approved direction; pending implementation-plan review

## Objective

Reduce the open Dependabot alerts recorded against `pnpm-lock.yaml` without
turning a dependency update into an unbounded application rewrite. The target
is every alert that has a compatible upstream fix, with a documented reason for
any alert that cannot be removed safely in this change.

## Observed dependency roots

The alert list is concentrated in a small number of roots rather than 108
independent fixes:

| Root | Current state | Design decision |
| --- | --- | --- |
| `axios` | Direct dependency but no source import/use | Remove it. This also removes its `form-data` and `follow-redirects` subtree. |
| `next` | Direct dependency at 16.1.6 | Update within Next 16 to the current secure patch line. |
| `firebase-admin` | Direct dependency at 13.6.1 | Update to 14.x, which pulls fixed Firebase/Google dependency paths where available. |
| Runtime | `.nvmrc` says Node 18.17.0 | Set the supported project runtime to Node 22, including `package.json` engines. |
| CSS/dev toolchain | Tailwind 3, Sass, PostCSS, ESLint and their transitives | Update compatible direct dependencies; use narrowly scoped lockfile overrides only for residual vulnerable transitives. |

`firebase-admin` is used by the guestbook, contact, and article-comment server
repositories. Tailwind is used by `styles/globals.css` and the PostCSS config,
so neither can be removed as dead dependencies.

## Chosen approach

Adopt a security baseline update with bounded compatibility work:

1. Remove unused `axios` and regenerate the lockfile.
2. Move the runtime contract to Node 22:
   - update `.nvmrc`;
   - add `engines.node` to `package.json`;
   - record the Vercel Node-runtime requirement in the handoff/result.
3. Upgrade Next only within major version 16, Firebase Admin to major version
   14, and current compatible versions of direct build dependencies.
4. Inspect the regenerated dependency graph and apply `pnpm.overrides` only
   where a vulnerable transitive package remains and the replacement satisfies
   the consumer's declared compatibility range.
5. Preserve Tailwind 3 in this remediation. Tailwind 4 is a separate CSS build
   migration, not a prerequisite for the application security baseline.

## Compatibility boundaries

- The Firebase server module uses public Admin SDK imports (`firebase-admin/app`
  and `firebase-admin/firestore`) and REST-preferred Firestore initialization.
  Its initialization and comment/guestbook/contact flows must be tested after
  the 14.x upgrade.
- Node 22 is required for the selected Firebase Admin line. Deployments must
  run with Node 22 or later; local development already has a Node 22 runtime.
- Next remains on 16.x to avoid an application-router major migration.
- No Tailwind class, stylesheet, content-path, or design changes are intended.
- Do not blindly override all advisory package names. Overrides are permitted
  only after `pnpm why` demonstrates the path and package compatibility is
  checked.

## Implementation outline

1. Add regression coverage for the Firebase initialization boundary if existing
   tests do not cover it.
2. Update manifests and lockfile using pnpm under Node 22.
3. Re-run `pnpm why` for all remaining advisory roots and add minimal overrides
   for eligible residual vulnerabilities.
4. Run the security audit and record remaining alerts by advisory/package/path.
5. Run lint, TypeScript, Notion integration test, and a production build.
6. Exercise the comment API with configured Firebase credentials when available;
   do not log or commit any credentials.

## Verification and acceptance criteria

The change is accepted when all of the following are true:

- `axios` is absent from both manifest and lockfile, unless a new verified code
  use is discovered before implementation.
- Node 22 is the declared runtime in `.nvmrc` and `package.json`.
- The lockfile resolves the selected secure Next and Firebase Admin lines.
- `pnpm audit --json` is run against the regenerated lockfile. Remaining
  alerts, if any, are listed with their dependency path and remediation status.
- `pnpm lint`, `pnpm exec tsc --noEmit --incremental false`, `pnpm test:notion`,
  and a production build succeed.
- The Firebase-backed comment read endpoint is proven healthy in an environment
  with valid Firebase configuration, or is explicitly reported as externally
  blocked rather than inferred from static checks.

## Rollback

The remediation will be a focused commit. If a deployment regression occurs,
revert that commit to restore the current manifest and lockfile together. Do
not partially roll back only `package.json` or only `pnpm-lock.yaml`.
