import "../styles/globals.css";
import "98.css";
import { ApplicationStoreProvider } from "../zustand/application/applicationProvider";
import SvgDefs from "@lib/components/SvgDefs";
import GlobalDesktopShell from "./GlobalDesktopShell"; // ✅ 새로 추가(클라이언트 컴포넌트)
import { GlobalWindowsHub } from "./GlobalWindowsHub";

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang="ko" id={params.lang}>
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
          {children}
        </ApplicationStoreProvider>
      </body>
    </html>
  );
}
