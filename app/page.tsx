import { Metadata } from "next";

export const metadata: Metadata = {
  title: "hg-blog",
  description: "HG's personal blog with Windows 98 style interface",
};

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to hg-blog</h1>
      <p>This is a Windows 98-style blog interface.</p>
    </div>
  );
}
