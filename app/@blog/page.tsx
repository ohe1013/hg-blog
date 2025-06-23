import { NotionAPI } from "notion-client";
import Renderer from "../../features/notion/Renderer";
export default async function BlogPage() {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage(
    "study-react-732f1b8600004f14bae67e6d115df05c"
  );
  return (
    <Renderer
      recordMap={recordMap}
      rootPageId={"study-react-732f1b8600004f14bae67e6d115df05c"}
      rootUrl={"blog"}
    />
  );
}
