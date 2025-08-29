import { NotionAPI } from "notion-client";
import Renderer from "../../features/notion/Renderer";
import { rootDir } from "@features/notion/data";
export default function About() {
  const notion = new NotionAPI();
  const recordMap = notion.getPage(rootDir.about);
  return (
    <Renderer
      recordMap={recordMap}
      rootPageId={rootDir.about}
      rootUrl={"about"}
    />
  );
}
