import { NextResponse } from "next/server";
import { NotionAPI } from "notion-client";

export async function GET(
  _req: Request,
  { params }: { params: { pageId: string } }
) {
  try {
    const notion = new NotionAPI();
    const recordMap = await notion.getPage(params.pageId);

    // 캐시 정책은 취향껏 (예: 60초)
    return NextResponse.json(
      { recordMap },
      {
        headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
      }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "failed to fetch" }, { status: 500 });
  }
}
