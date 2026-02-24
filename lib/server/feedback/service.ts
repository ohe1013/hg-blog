import { createHash } from "crypto";
import {
  ArticleCommentCreatePayload,
  ContactCreatePayload,
  GuestbookCreatePayload,
  RequestContext,
} from "./types";
import { FeedbackRepository } from "./repositories/types";
import { hashGuestbookPassword } from "./security";

function hashIp(ip: string): string {
  const salt = process.env.FEEDBACK_IP_HASH_SALT ?? "change-this-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

function hasHoneypotValue(value?: string): boolean {
  return Boolean(value && value.trim().length > 0);
}

export async function createGuestbookEntry(
  repository: FeedbackRepository,
  payload: GuestbookCreatePayload,
  context: RequestContext,
) {
  const spam = hasHoneypotValue(payload.website);
  const initialStatus = spam
    ? "spam"
    : payload.isSecret
      ? "hidden"
      : "published";

  return repository.createGuestbookEntry({
    nickname: payload.nickname.trim(),
    passwordHash: hashGuestbookPassword(payload.password.trim()),
    message: payload.message.trim(),
    status: initialStatus,
    ipHash: hashIp(context.ip),
    userAgent: context.userAgent,
  });
}

export async function createArticleComment(
  repository: FeedbackRepository,
  payload: ArticleCommentCreatePayload,
  context: RequestContext,
) {
  const spam = hasHoneypotValue(payload.website);

  return repository.createArticleComment({
    articlePageId: payload.articlePageId.trim(),
    nickname: payload.nickname.trim(),
    passwordHash: hashGuestbookPassword(payload.password.trim()),
    message: payload.message.trim(),
    status: spam ? "spam" : "published",
    ipHash: hashIp(context.ip),
    userAgent: context.userAgent,
  });
}

export async function createContactMessage(
  repository: FeedbackRepository,
  payload: ContactCreatePayload,
  context: RequestContext,
) {
  const spam = hasHoneypotValue(payload.website);

  return repository.createContactMessage({
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    subject: payload.subject.trim(),
    message: payload.message.trim(),
    status: spam ? "spam" : "new",
    ipHash: hashIp(context.ip),
    userAgent: context.userAgent,
  });
}
