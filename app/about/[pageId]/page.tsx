import Renderer from "@features/notion/Renderer";
import { NotionAPI } from "notion-client";

interface fetchEachPagesProps {
  params: {
    pageId: string; // pageId 추출
  };
}

const fetchEachPages = async ({ params }: fetchEachPagesProps) => {
  const notion = new NotionAPI();
  const recordMap = await notion.getPage(params.pageId);
  return (
    <Renderer
      recordMap={recordMap}
      rootPageId={params.pageId}
      rootUrl={"about"}
    />
  );
};

export default fetchEachPages;
