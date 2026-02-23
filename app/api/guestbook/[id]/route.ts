import { NextRequest, NextResponse } from "next/server";
import {
  AppError,
  BadRequestError,
  RateLimitError,
  UnauthorizedError,
} from "@lib/server/feedback/errors";
import { getFeedbackRepository } from "@lib/server/feedback/repositories";
import { getRequestContext } from "@lib/server/feedback/request";
import { consumeRateLimit } from "@lib/server/feedback/rateLimit";
import {
  validateGuestbookActionPayload,
  validateGuestbookPasswordPayload,
} from "@lib/server/feedback/validation";
import { hashGuestbookPassword } from "@lib/server/feedback/security";

export const runtime = "nodejs";
const ACTION_RATE_LIMIT_PER_MINUTE = 6;
const ACTION_RATE_LIMIT_WINDOW_MS = 60 * 1000;

type RouteContext = {
  params: Promise<{ id: string }>;
};

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
  console.error("[guestbook-item-api]", { message });
  return NextResponse.json(
    {
      error: "internal_error",
      message: "Unexpected server error.",
    },
    { status: 500 },
  );
}

export async function PATCH(req: NextRequest, routeContext: RouteContext) {
  try {
    const { id } = await routeContext.params;
    if (!id) {
      throw new BadRequestError("Guestbook id is required.");
    }

    const requestContext = getRequestContext(req);
    const allow = consumeRateLimit(
      `guestbook-action:${requestContext.ip}:${id}`,
      ACTION_RATE_LIMIT_PER_MINUTE,
      ACTION_RATE_LIMIT_WINDOW_MS,
    );
    if (!allow) {
      throw new RateLimitError("Too many guestbook actions. Try in a minute.");
    }

    let jsonBody: unknown;
    try {
      jsonBody = await req.json();
    } catch {
      throw new BadRequestError("Request body must be valid JSON.");
    }

    const { status, password } = validateGuestbookActionPayload(jsonBody);
    const repository = getFeedbackRepository();
    const updated = await repository.updateGuestbookStatus(
      id,
      status,
      hashGuestbookPassword(password),
    );
    if (!updated) {
      throw new UnauthorizedError("Entry not found or password mismatch.");
    }

    return NextResponse.json({
      id: updated.id,
      status: updated.status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, routeContext: RouteContext) {
  try {
    const { id } = await routeContext.params;
    if (!id) {
      throw new BadRequestError("Guestbook id is required.");
    }

    const requestContext = getRequestContext(req);
    const allow = consumeRateLimit(
      `guestbook-action:${requestContext.ip}:${id}`,
      ACTION_RATE_LIMIT_PER_MINUTE,
      ACTION_RATE_LIMIT_WINDOW_MS,
    );
    if (!allow) {
      throw new RateLimitError("Too many guestbook actions. Try in a minute.");
    }

    let jsonBody: unknown;
    try {
      jsonBody = await req.json();
    } catch {
      throw new BadRequestError("Request body must be valid JSON.");
    }

    const { password } = validateGuestbookPasswordPayload(jsonBody);
    const repository = getFeedbackRepository();
    const deleted = await repository.deleteGuestbookEntry(
      id,
      hashGuestbookPassword(password),
    );
    if (!deleted) {
      throw new UnauthorizedError("Entry not found or password mismatch.");
    }

    return NextResponse.json({
      id,
      deleted: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
