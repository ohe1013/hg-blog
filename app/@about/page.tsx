import { NotionAPI } from "notion-client";
import Renderer from "../../features/notion/Renderer";
export default async function About() {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage(
    "devloper-88d3fb4a1ab64838a9d755b69d7cb80e"
  );
  return (
    <Renderer
      recordMap={recordMap}
      rootPageId={"devloper-88d3fb4a1ab64838a9d755b69d7cb80e"}
    />
  );
}
