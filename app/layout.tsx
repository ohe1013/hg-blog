import "../styles/globals.css";
import "98.css";
import { ApplicationStoreProvider } from "../zustand/application/applicationProvider";
import SvgDefs from "@lib/components/SvgDefs";
import GlobalDesktopShell from "./GlobalDesktopShell";
import { GlobalWindowsHub } from "./GlobalWindowsHub";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "HG Blog",
    template: "%s | HG Blog",
  },
  description:
    "A Windows 98-style personal blog sharing development journey and thoughts.",
  openGraph: {
    title: "HG Blog",
    description:
      "A Windows 98-style personal blog sharing development journey and thoughts.",
    url:
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
    siteName: "HG Blog",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HG Blog",
    description:
      "A Windows 98-style personal blog sharing development journey and thoughts.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" id="ko">
      <head>
        <meta charSet="utf-8" />
        <title>hg-blog</title>
        <link
          rel="icon"
          href="https://win98icons.alexmeub.com/icons/png/msie1-0.png"
        />
      </head>
      <body>
        <SvgDefs />
        <ApplicationStoreProvider>
          <GlobalDesktopShell />
          <GlobalWindowsHub />
          {/* SSR Content: Hidden but present for SEO */}
          <div style={{ display: "none" }} aria-hidden="true">
            {children}
          </div>
        </ApplicationStoreProvider>
      </body>
    </html>
  );
}
