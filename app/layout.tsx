import "../styles/globals.css";
import "98.css";
import { ApplicationStoreProvider } from "../zustand/application/applicationProvider";
import SvgDefs from "@lib/components/SvgDefs";
import GlobalDesktopShell from "./GlobalDesktopShell";
import { GlobalWindowsHub } from "./GlobalWindowsHub";

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
        </ApplicationStoreProvider>
      </body>
    </html>
  );
}
