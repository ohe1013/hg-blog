import { NextRequest, NextResponse } from "next/server";
import { AppError, BadRequestError, RateLimitError } from "@lib/server/feedback/errors";
import { getRequestContext } from "@lib/server/feedback/request";
import { consumeRateLimit } from "@lib/server/feedback/rateLimit";
import { createArticleComment } from "@lib/server/feedback/service";
import {
  parseArticleCommentListOptions,
  validateArticleCommentPayload,
} from "@lib/server/feedback/validation";
import { getFeedbackRepository } from "@lib/server/feedback/repositories";

const RATE_LIMIT_PER_MINUTE = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

export const runtime = "nodejs";

function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.code,
        message: error.message,
        details: error.details,
      },
      { status: error.status },
    );
  }

  const message =
    error instanceof Error ? error.message : "Unknown error object";
  console.error("[comments-api]", { message });
  return NextResponse.json(
    {
      error: "internal_error",
      message: "Unexpected server error.",
    },
    { status: 500 },
  );
}

export async function GET(req: NextRequest) {
  try {
    const options = parseArticleCommentListOptions(req.nextUrl.searchParams);
    const repository = getFeedbackRepository();
    const result = await repository.listArticleComments(options);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = getRequestContext(req);
    const allow = consumeRateLimit(
      `comments:${context.ip}`,
      RATE_LIMIT_PER_MINUTE,
      RATE_LIMIT_WINDOW_MS,
    );
    if (!allow) {
      throw new RateLimitError("Too many comment submissions. Try in a minute.");
    }

    let jsonBody: unknown;
    try {
      jsonBody = await req.json();
    } catch {
      throw new BadRequestError("Request body must be valid JSON.");
    }

    const payload = validateArticleCommentPayload(jsonBody);
    const repository = getFeedbackRepository();
    const created = await createArticleComment(repository, payload, context);

    return NextResponse.json(
      {
        id: created.id,
        createdAt: created.createdAt,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
