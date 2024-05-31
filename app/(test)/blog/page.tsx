import Renderer from "../../../features/notion/Renderer";
import { NotionAPI } from "notion-client";
import { WindowResizeHeader, WindowBody, Window } from "../../../features/window/components";

export default async function Blog() {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage("study-react-732f1b8600004f14bae67e6d115df05c");
  return (
    <Window>
      <WindowResizeHeader title="notion" type="resize"></WindowResizeHeader>
      <WindowBody>
        <Renderer
          recordMap={recordMap}
          rootPageId={"study-react-732f1b8600004f14bae67e6d115df05c"}
        />
      </WindowBody>
    </Window>
  );
}
