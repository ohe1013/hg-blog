import { NextRequest, NextResponse } from "next/server";
import { getNotionPage } from "@lib/server/notion";

type RouteContext = {
  params: Promise<{ pageId: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { pageId } = await context.params; // 🔹 여기서 await 필요

    const recordMap = await getNotionPage(pageId);

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
