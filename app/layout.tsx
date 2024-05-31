import { cookies } from "next/headers";
import "../styles/globals.css";
import "98.css";

type PageProps = {
  children: React.ReactNode;
  params: {
    lang: string;
  };
};
export default async function RootLayout({ children, params: { lang } }: PageProps) {
  const Cookies = cookies();

  return (
    <html lang="ko" id={lang}>
      <head>
        <meta charSet="utf-8" />
        <title>hg-blog</title>
        <link rel="icon" href="https://win98icons.alexmeub.com/icons/png/msie1-0.png" sizes="any" />
      </head>
      <body className={cookies().get("your-mode")?.value || "light"}>{children}</body>
    </html>
  );
}
