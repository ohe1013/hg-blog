import { NotionAPI } from "notion-client";
import Renderer from "../../features/notion/Renderer";
import { rootDir } from "@features/notion/data";
export default async function BlogPage() {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage(rootDir.blog);
  return (
    <Renderer
      recordMap={recordMap}
      rootPageId={rootDir.blog}
      rootUrl={"blog"}
    />
  );
}
