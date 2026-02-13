import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ pageId: string }> }
) {
  const { pageId } = await context.params;
  return NextResponse.redirect(new URL(`/api/notion/page/${pageId}`, request.url));
}
