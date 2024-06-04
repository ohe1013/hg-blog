"use client";
import { NotionAPI } from "notion-client";
import Renderer from "../../../../features/notion/Renderer";

interface fetchEachPagesProps {
  params: {
    pageId: string; // pageId 추출
  };
}

const fetchEachPages = async ({ params }: fetchEachPagesProps) => {
  try {
    const notion = new NotionAPI();
    const recordMap = await notion.getPage(params.pageId);
    return <Renderer recordMap={recordMap} rootPageId={params.pageId} />;
  } catch (error) {
    return console.error(error);
  }
};

export default fetchEachPages;
