import { cookies } from "next/headers";
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
      <body className={cookies().get("your-mode")?.value || "light"}>
        <header>hi</header>
        {children}
      </body>
    </html>
  );
}
