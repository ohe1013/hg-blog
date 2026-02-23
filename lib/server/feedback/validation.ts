import {
  ContactCreatePayload,
  GuestbookCreatePayload,
  GuestbookListOptions,
} from "./types";
import { ValidationError } from "./errors";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type StringRule = {
  min?: number;
  max?: number;
  required?: boolean;
};

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ValidationError("Request body must be a JSON object.");
  }
  return value as Record<string, unknown>;
}

function normalizeField(
  raw: unknown,
  field: string,
  errors: string[],
  rule: StringRule,
): string | undefined {
  if (raw == null) {
    if (rule.required) errors.push(`${field} is required.`);
    return undefined;
  }

  if (typeof raw !== "string") {
    errors.push(`${field} must be a string.`);
    return undefined;
  }

  const value = raw.trim();
  if (rule.required && value.length === 0) {
    errors.push(`${field} is required.`);
    return undefined;
  }

  if (rule.min !== undefined && value.length < rule.min) {
    errors.push(`${field} must be at least ${rule.min} characters.`);
  }

  if (rule.max !== undefined && value.length > rule.max) {
    errors.push(`${field} must be at most ${rule.max} characters.`);
  }

  return value;
}

export function parseGuestbookListOptions(
  searchParams: URLSearchParams,
): GuestbookListOptions {
  const rawLimit = searchParams.get("limit");
  const rawCursor = searchParams.get("cursor");

  let limit = DEFAULT_LIMIT;
  if (rawLimit !== null) {
    const parsed = Number.parseInt(rawLimit, 10);
    if (!Number.isFinite(parsed) || parsed < 1) {
      throw new ValidationError("limit must be a positive integer.");
    }
    limit = Math.min(parsed, MAX_LIMIT);
  }

  const cursor = rawCursor?.trim();
  return { limit, cursor: cursor || null };
}

export function validateGuestbookPayload(
  input: unknown,
): GuestbookCreatePayload {
  const body = asRecord(input);
  const errors: string[] = [];

  const nickname = normalizeField(body.nickname, "nickname", errors, {
    required: true,
    min: 2,
    max: 24,
  });
  const password = normalizeField(body.password, "password", errors, {
    required: true,
    min: 4,
    max: 64,
  });
  const message = normalizeField(body.message, "message", errors, {
    required: true,
    min: 1,
    max: 500,
  });
  const website = normalizeField(body.website, "website", errors, {
    max: 300,
  });

  let isSecret = false;
  if (body.isSecret !== undefined) {
    if (typeof body.isSecret !== "boolean") {
      errors.push("isSecret must be a boolean.");
    } else {
      isSecret = body.isSecret;
    }
  }

  if (errors.length > 0) {
    throw new ValidationError("Guestbook payload validation failed.", errors);
  }

  return {
    nickname: nickname!,
    password: password!,
    message: message!,
    isSecret,
    website,
  };
}

export function validateGuestbookActionPayload(input: unknown): {
  status: "hidden" | "published";
  password: string;
} {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ValidationError("Request body must be a JSON object.");
  }

  const errors: string[] = [];
  const body = input as Record<string, unknown>;

  const status = String(body.status ?? "")
    .trim()
    .toLowerCase();
  const password = normalizeField(body.password, "password", errors, {
    required: true,
    min: 4,
    max: 64,
  });

  if (!(status === "hidden" || status === "published")) {
    errors.push('status must be one of: "hidden", "published".');
  }

  if (errors.length > 0) {
    throw new ValidationError("Guestbook action payload validation failed.", errors);
  }

  return {
    status: status as "hidden" | "published",
    password: password!,
  };
}

export function validateGuestbookPasswordPayload(input: unknown): {
  password: string;
} {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ValidationError("Request body must be a JSON object.");
  }

  const errors: string[] = [];
  const body = input as Record<string, unknown>;
  const password = normalizeField(body.password, "password", errors, {
    required: true,
    min: 4,
    max: 64,
  });

  if (errors.length > 0) {
    throw new ValidationError("Guestbook password payload validation failed.", errors);
  }

  return {
    password: password!,
  };
}

export function validateContactPayload(input: unknown): ContactCreatePayload {
  const body = asRecord(input);
  const errors: string[] = [];

  const name = normalizeField(body.name, "name", errors, {
    required: true,
    min: 2,
    max: 40,
  });
  const email = normalizeField(body.email, "email", errors, {
    required: true,
    min: 5,
    max: 120,
  });
  const subject = normalizeField(body.subject, "subject", errors, {
    required: true,
    min: 1,
    max: 120,
  });
  const message = normalizeField(body.message, "message", errors, {
    required: true,
    min: 1,
    max: 2000,
  });
  const website = normalizeField(body.website, "website", errors, {
    max: 300,
  });

  if (email && !EMAIL_PATTERN.test(email)) {
    errors.push("email format is invalid.");
  }

  if (errors.length > 0) {
    throw new ValidationError("Contact payload validation failed.", errors);
  }

  return {
    name: name!,
    email: email!,
    subject: subject!,
    message: message!,
    website,
  };
}
