import "../styles/globals.css";
import "98.css";
import { ReactNode } from "react";
import { ApplicationStoreProvider } from "../zustand/application/applicationProvider";
import ClientDesktopWrapper from "@features/desktop/components/ClientDesktopWrapper";
import SvgDefs from "@lib/components/SvgDefs";

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
export default async function RootLayout(props: PageProps) {
  return (
    <html lang="ko" id={props.params.lang}>
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
        <SvgDefs />
        <ApplicationStoreProvider>
          <ClientDesktopWrapper {...props} />
        </ApplicationStoreProvider>
      </body>
    </html>
  );
}
