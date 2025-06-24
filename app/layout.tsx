import "../styles/globals.css";
import "98.css";
import { ReactNode } from "react";
import { Desktop, DesktopIconGrid } from "../features/desktop/components";
import { StartBar } from "../features/startBar/components";
import { ApplicationStoreProvider } from "../zustand/application/applicationProvider";

type PageProps = {
  children: React.ReactNode;
  params: {
    lang: string;
  };
  blog: ReactNode;
  about: ReactNode;
  computer: ReactNode;
  document: ReactNode;
};
export default async function RootLayout({
  children,
  params: { lang },
  blog,
  about,
  computer,
  document,
}: PageProps) {
  return (
    <html lang="ko" id={lang}>
      <head>
        <meta charSet="utf-8" />
        <title>hg-blog</title>
        <link
          rel="icon"
          href="https://win98icons.alexmeub.com/icons/png/msie1-0.png"
          sizes="any"
        />
      </head>
      <body>
        <ApplicationStoreProvider>
          <Desktop>
            <DesktopIconGrid></DesktopIconGrid>
            {children}
            {blog}
            {about}
            {computer}
            {document}
            <StartBar />
          </Desktop>
        </ApplicationStoreProvider>
      </body>
    </html>
  );
}
