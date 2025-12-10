import { NextRequest, NextResponse } from "next/server";
import { NotionAPI } from "notion-client";

type RouteContext = {
  params: Promise<{ pageId: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { pageId } = await context.params; // 🔹 여기서 await 필요

    const notion = new NotionAPI();
    const recordMap = await notion.getPage(pageId);

    return NextResponse.json(
      { recordMap },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "failed to fetch" }, { status: 500 });
  }
}
