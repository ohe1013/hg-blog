import { NotionAPI } from "notion-client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { pageId: string } }
) {
  const notion = new NotionAPI();
  try {
    const { pageId } = await context.params;
    const recordMap = await notion.getPage(pageId);
    return NextResponse.json(recordMap);
  } catch (error) {
    console.error("Failed to fetch notion page:", error);
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 }
    );
  }
}
