# SEO hardening design

**Date:** 2026-08-14
**Status:** Approved

## Objective

Raise the deployed blog from basic crawlability to a stable technical SEO
baseline without changing the visible Windows 98 desktop experience or
replacing the existing public article URLs.

The change addresses the verified production issues: duplicate document
titles, missing canonicals, multiple working aliases for the same Notion page,
unknown page IDs returning 500, incomplete descriptions, invalid or missing
Open Graph URL/image data, request-time sitemap timestamps, and a second
client-side Notion fetch after route hydration.

## Confirmed product constraints

- Preserve the current Windows 98 desktop, window, and navigation visuals.
- Keep every URL currently emitted by `sitemap.xml` as the canonical public URL.
- Do not introduce a separate search-only blog or migrate articles to new slugs.
- Do not perform the larger server-rendered Zustand window-state redesign in
  this change.
- Preserve the Notion-backed authoring flow.

## Chosen approach

Apply an incremental SEO hardening layer around the existing route and Notion
data flow:

1. Treat the article/about entries in the local file-system registry as the
   allowlist and source of canonical route IDs.
2. Normalize alternate Notion UUID spellings and permanently redirect them to
   the exact registry path.
3. Reject IDs that do not resolve to a registry entry with a real 404 before
   requesting Notion.
4. Centralize site URL and metadata construction.
5. Extract complete plain text and timestamps from the already-fetched Notion
   record map.
6. Reuse that record map across metadata, route rendering, and the initial
   client viewer state.
7. Generate stable sitemap entries and a code-generated social card.

## Canonical route identity

The exact `pageId` stored in `features/fs/data/articles.ts` or
`features/fs/data/about.ts` is canonical. This preserves all currently indexed
and sitemap-listed paths, including canonical values that contain a readable
prefix.

A pure route resolver will compare an incoming route segment in two stages:

1. Exact canonical `pageId` match: continue without redirect.
2. Equivalent terminal Notion UUID match: return the canonical registry ID.

UUID comparison is case-insensitive and ignores UUID hyphens. It accepts a
32-hex-character terminal ID, including a readable prefix before that ID. An
equivalent but non-canonical input receives a permanent redirect to the exact
canonical path. A value with no matching registry entry is not found.

The resolver is shared by article and about routes. The page layer translates
resolver results into `permanentRedirect()` or `notFound()`. A known route whose
Notion request fails remains a server failure instead of being mislabeled as a
missing page.

## Site URL and metadata

A single server-safe helper will construct the site origin in this order:

1. `NEXT_PUBLIC_SITE_URL`, when configured;
2. `https://${VERCEL_PROJECT_PRODUCTION_URL}`;
3. `http://localhost:5170` for local development.

The helper parses the value through `URL`, strips the trailing path slash for
string composition, and prevents a protocol-less Open Graph URL. The example
environment file will document `NEXT_PUBLIC_SITE_URL`.

The root metadata will define:

- `metadataBase` from the normalized site origin;
- title default/template and description;
- canonical `/` and valid absolute Open Graph URL;
- site name, Korean locale, and Twitter large-card metadata;
- the existing favicon through the Metadata API;
- the existing Google verification value once, through the Metadata API.

The manually authored root `<head>` title, charset, verification tag, and icon
link will be removed. Next owns those tags so each route produces one title.

List pages receive route-specific canonicals and social URLs. Detail pages
receive canonical URL, article title, intentional excerpt, publication and
modification time when available, and article-specific Open Graph type data.

## Notion SEO extraction

A focused utility will convert the Notion record map into an SEO document:

```ts
type NotionSeoDocument = {
  title: string;
  description: string;
  bodyText: string;
  datePublished?: string;
  dateModified?: string;
};
```

Plain-text extraction joins every textual fragment in a block property instead
of reading only `properties.title[0][0]`. The description uses the first useful
body text, normalizes whitespace, and truncates at 160 characters. If no body
text exists, it uses the existing route-specific fallback copy.

The root page block supplies creation and last-edited timestamps when valid.
Invalid or absent timestamps are omitted rather than replaced with the current
time.

`getNotionPage()` will be request-memoized so `generateMetadata()` and the page
component share a single upstream operation for a canonical detail request.

## Rendering and client data flow

The route continues to render the existing semantic title/article summary used
by the desktop architecture. The fetched record map is additionally passed to
the route initializer and stored in the viewer window parameters. The viewer
uses it as its initial record map and skips its mount-time API fetch.

Client navigation to a different Notion child page may still fetch that child
record map. About routes pass their own `rootUrl` to the shared viewer so child
links remain under `/about` instead of being rewritten to `/article`.

This reduces the time and failure surface before crawlers that execute
JavaScript can see the full article. Rendering the entire live window tree in
the initial server HTML is explicitly deferred because it requires server
initialization of the global Zustand window store and has a materially larger
UI regression surface.

## Structured data and social image

Detail pages emit one safely serialized `BlogPosting` JSON-LD object with:

- `headline` and `description`;
- canonical `url` and `mainEntityOfPage`;
- `datePublished` and `dateModified` when available;
- author type/name and the canonical about URL;
- the generated social image URL.

JSON serialization escapes `<` so Notion-authored text cannot terminate the
script element.

A file-based 1200x630 Open Graph image will be generated in code with the
existing Windows 98 visual language and site identity. It is a common site card
for this bounded change; article-specific image composition is not required.
The image is attached to Open Graph and Twitter metadata through Next's
file-based metadata convention.

## Sitemap and robots behavior

`robots.txt` continues to allow the site and reference the normalized
production sitemap URL.

The sitemap keeps the current nine canonical URLs. Fixed routes omit
`lastModified` because the repository does not carry a trustworthy content
timestamp for them. Detail entries use Notion `dateModified`, falling back to
`datePublished`; if neither exists, `lastModified` is omitted.

The sitemap no longer uses `force-dynamic`, `Date.now()`, or synthetic post
creation dates. It retains a one-hour revalidation boundary. A failed Notion
timestamp lookup does not remove an allowlisted canonical URL; that entry is
emitted without `lastModified`.

Article/about list markup stops emitting a `<time>` value when no real source
timestamp exists.

## Error handling

- Canonical route: render normally.
- Known alias: permanent redirect to the canonical route.
- Unknown route ID: Next 404 response.
- Known route with unavailable/corrupt Notion data: server error, visible in
  deployment monitoring.
- Missing optional description/date/image metadata: deterministic fallback or
  omission, never the current clock time.
- One failed sitemap timestamp lookup: keep the URL and omit its timestamp.

## Test strategy

Implementation follows red-green-refactor. Tests will cover real pure behavior
before production code is added:

- site-origin normalization for explicit, Vercel, and local values;
- exact canonical, equivalent alias, and unknown route resolution;
- complete rich-text fragment extraction and 160-character descriptions;
- publication/modification timestamp omission and fallback behavior;
- safe JSON-LD serialization;
- sitemap entries staying canonical and free of request-time timestamps;
- source contracts preventing a manual root `<title>` and preventing
  mount-time refetch when initial record-map data is present.

Verification after focused tests includes the existing full test suite,
TypeScript without incremental output, ESLint, a Next production build, and
HTTP inspection of `/`, list/detail pages, an alias, an unknown ID,
`robots.txt`, and `sitemap.xml`.

## Acceptance criteria

The implementation is accepted when all of the following are true:

- Visible Windows 98 UI and existing canonical route paths are unchanged.
- Every inspected HTML document contains exactly one route-correct title.
- Home, list, and detail pages emit absolute canonical URLs.
- The deployed-origin Open Graph URL includes `https://` and every page has a
  usable social image.
- All known aliases tested return a permanent redirect to the registry path.
- An unknown article or about ID returns 404, not 500 or 200.
- Article descriptions use complete Notion text fragments.
- A detail route performs one initial Notion page operation per server render
  and the viewer performs no duplicate mount fetch.
- JSON-LD is valid, canonical, and safely serialized.
- Consecutive sitemap requests do not invent new `lastmod` values.
- Existing tests plus new SEO tests, typecheck, lint, and production build pass.

## Non-goals

- Custom-domain migration, redirects away from `hg-blog.vercel.app`, or DNS
  work.
- Search Console submission, backlink work, keyword strategy, or content edits.
- Full server rendering of the Zustand-managed desktop/window tree.
- Article-specific social artwork or automatic Notion cover-image processing.
- Locale routing or `hreflang` until translated pages actually exist.

## Rollback

The SEO implementation will be kept in focused commits after this design and
its implementation plan. If deployment behavior regresses, revert the
implementation commits together so route resolution, metadata, and sitemap
logic stay consistent. The current canonical paths are never renamed, so no
reverse URL migration is required.
