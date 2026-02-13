const rootDir = {
  about: "devloper-88d3fb4a1ab64838a9d755b69d7cb80e",
  articles: "study-react-732f1b8600004f14bae67e6d115df05c",
};

export function getSiteBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:5170";
}

export { rootDir };
