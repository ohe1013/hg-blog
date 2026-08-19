declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_SITE_URL?: string;
    readonly VERCEL_PROJECT_PRODUCTION_URL?: string;
  }
}
