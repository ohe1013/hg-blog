export type SiteUrlEnv = Readonly<{
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
}>;

const LOCAL_SITE_URL = "http://localhost:5170";

function withProtocol(value: string): string {
  return /^[a-z][a-z\d+.-]*:\/\//i.test(value)
    ? value
    : `https://${value}`;
}

export function getSiteUrl(env: SiteUrlEnv = process.env): URL {
  const configured =
    env.NEXT_PUBLIC_SITE_URL ?? env.VERCEL_PROJECT_PRODUCTION_URL;
  return new URL(configured ? withProtocol(configured) : LOCAL_SITE_URL);
}

export function getSiteBaseUrl(env: SiteUrlEnv = process.env): string {
  return getSiteUrl(env).origin;
}

export function getAbsoluteUrl(
  path: string,
  env: SiteUrlEnv = process.env,
): string {
  return new URL(path, `${getSiteBaseUrl(env)}/`).toString();
}
