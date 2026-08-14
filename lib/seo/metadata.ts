import type { Metadata } from "next";
import type { NotionSeoDocument } from "./notion";
import {
  getAbsoluteUrl,
  getSiteUrl,
  type SiteUrlEnv,
} from "./site";

export const SITE_NAME = "HG Blog";
export const SITE_DESCRIPTION =
  "A Windows 98-style personal blog sharing development journey and thoughts.";

const ICON_URL = "https://win98icons.alexmeub.com/icons/png/msie1-0.png";

export function createRootMetadata(
  env: SiteUrlEnv = process.env,
): Metadata {
  return {
    metadataBase: getSiteUrl(env),
    title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
    description: SITE_DESCRIPTION,
    alternates: { canonical: "/" },
    icons: { icon: ICON_URL },
    openGraph: {
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: getAbsoluteUrl("/", env),
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
    },
    verification: {
      google: "NZkIQWgMM6RC0fCX1PcdfmNinajsC837Lsa3qXzFoeA",
    },
  };
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  kind?: "website" | "article";
  datePublished?: string;
  dateModified?: string;
};

export function createPageMetadata(
  input: PageMetadataInput,
  env: SiteUrlEnv = process.env,
): Metadata {
  const shared = {
    title: input.title,
    description: input.description,
    url: getAbsoluteUrl(input.path, env),
    siteName: SITE_NAME,
    locale: "ko_KR",
  };
  const openGraph =
    input.kind === "article"
      ? {
          ...shared,
          type: "article" as const,
          ...(input.datePublished
            ? { publishedTime: input.datePublished }
            : {}),
          ...(input.dateModified ? { modifiedTime: input.dateModified } : {}),
          authors: ["HG"],
        }
      : { ...shared, type: "website" as const };

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: input.path },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
    },
  };
}

export function createBlogPostingJsonLd(
  input: { document: NotionSeoDocument; path: string },
  env: SiteUrlEnv = process.env,
) {
  const url = getAbsoluteUrl(input.path, env);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.document.title,
    description: input.document.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: getAbsoluteUrl("/opengraph-image", env),
    author: {
      "@type": "Person",
      name: "HG",
      url: getAbsoluteUrl("/about", env),
    },
    ...(input.document.datePublished
      ? { datePublished: input.document.datePublished }
      : {}),
    ...(input.document.dateModified
      ? { dateModified: input.document.dateModified }
      : {}),
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
