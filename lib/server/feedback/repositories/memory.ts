import { randomUUID } from "crypto";
import {
  ArticleComment,
  ArticleCommentListOptions,
  ArticleCommentListResult,
  ContactMessage,
  CreateArticleCommentInput,
  CreateContactMessageInput,
  CreateGuestbookEntryInput,
  GuestbookEntry,
  GuestbookListOptions,
  GuestbookListResult,
} from "../types";
import { FeedbackRepository } from "./types";

type MemoryArticleComment = ArticleComment & {
  passwordHash: string;
  ipHash: string;
  userAgent: string | null;
};

type MemoryGuestbook = GuestbookEntry & {
  passwordHash: string;
  ipHash: string;
  userAgent: string | null;
};

type MemoryContact = ContactMessage & {
  ipHash: string;
  userAgent: string | null;
};

const articleComments: MemoryArticleComment[] = [];
const guestbookEntries: MemoryGuestbook[] = [];
const contactMessages: MemoryContact[] = [];
const HIDDEN_COMMENT_MESSAGE = "Hidden comment.";
const HIDDEN_MESSAGE = "鍮꾨?泥섎━ ??湲?낅땲??";

function sortDescByCreatedAt<T extends { createdAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export class MemoryFeedbackRepository implements FeedbackRepository {
  async listArticleComments(
    options: ArticleCommentListOptions,
  ): Promise<ArticleCommentListResult> {
    const filtered = sortDescByCreatedAt(articleComments).filter(
      (entry) =>
        entry.articlePageId === options.articlePageId &&
        entry.status !== "spam",
    );

    let startIndex = 0;
    if (options.cursor) {
      const cursorIndex = filtered.findIndex((entry) => entry.id === options.cursor);
      if (cursorIndex >= 0) {
        startIndex = cursorIndex + 1;
      }
    }

    const slice = filtered.slice(startIndex, startIndex + options.limit + 1);
    const hasNext = slice.length > options.limit;
    const pageItems = hasNext ? slice.slice(0, options.limit) : slice;

    return {
      items: pageItems.map((entry) => ({
        id: entry.id,
        articlePageId: entry.articlePageId,
        nickname: entry.nickname,
        message:
          entry.status === "hidden" ? HIDDEN_COMMENT_MESSAGE : entry.message,
        createdAt: entry.createdAt,
        status: entry.status,
      })),
      nextCursor:
        hasNext && pageItems.length > 0
          ? pageItems[pageItems.length - 1]!.id
          : null,
    };
  }

  async createArticleComment(
    input: CreateArticleCommentInput,
  ): Promise<ArticleComment> {
    const now = new Date().toISOString();
    const entry: MemoryArticleComment = {
      id: randomUUID(),
      articlePageId: input.articlePageId,
      nickname: input.nickname,
      passwordHash: input.passwordHash,
      message: input.message,
      status: input.status,
      createdAt: now,
      ipHash: input.ipHash,
      userAgent: input.userAgent,
    };
    articleComments.push(entry);

    return {
      id: entry.id,
      articlePageId: entry.articlePageId,
      nickname: entry.nickname,
      message: entry.message,
      status: entry.status,
      createdAt: entry.createdAt,
    };
  }

  async updateArticleCommentStatus(
    id: string,
    status: "hidden" | "published",
    passwordHash: string,
  ): Promise<ArticleComment | null> {
    const index = articleComments.findIndex((entry) => entry.id === id);
    if (index < 0) return null;
    if (articleComments[index].passwordHash !== passwordHash) return null;

    const next = {
      ...articleComments[index],
      status,
    };
    articleComments[index] = next;

    return {
      id: next.id,
      articlePageId: next.articlePageId,
      nickname: next.nickname,
      message: next.message,
      createdAt: next.createdAt,
      status: next.status,
    };
  }

  async deleteArticleComment(id: string, passwordHash: string): Promise<boolean> {
    const target = articleComments.find((entry) => entry.id === id);
    if (!target) return false;
    if (target.passwordHash !== passwordHash) return false;

    const next = articleComments.filter((entry) => entry.id !== id);

    articleComments.length = 0;
    articleComments.push(...next);
    return true;
  }

  async listGuestbook(options: GuestbookListOptions): Promise<GuestbookListResult> {
    const filtered = sortDescByCreatedAt(guestbookEntries).filter(
      (entry) => entry.status !== "spam",
    );

    let startIndex = 0;
    if (options.cursor) {
      const cursorIndex = filtered.findIndex((entry) => entry.id === options.cursor);
      if (cursorIndex >= 0) {
        startIndex = cursorIndex + 1;
      }
    }

    const slice = filtered.slice(startIndex, startIndex + options.limit + 1);
    const hasNext = slice.length > options.limit;
    const pageItems = hasNext ? slice.slice(0, options.limit) : slice;

    return {
      items: pageItems.map((entry) => ({
        id: entry.id,
        nickname: entry.nickname,
        message: entry.status === "hidden" ? HIDDEN_MESSAGE : entry.message,
        createdAt: entry.createdAt,
        status: entry.status,
      })),
      nextCursor:
        hasNext && pageItems.length > 0
          ? pageItems[pageItems.length - 1]!.id
          : null,
    };
  }

  async createGuestbookEntry(
    input: CreateGuestbookEntryInput,
  ): Promise<GuestbookEntry> {
    const now = new Date().toISOString();
    const entry: MemoryGuestbook = {
      id: randomUUID(),
      nickname: input.nickname,
      passwordHash: input.passwordHash,
      message: input.message,
      status: input.status,
      createdAt: now,
      ipHash: input.ipHash,
      userAgent: input.userAgent,
    };
    guestbookEntries.push(entry);

    return {
      id: entry.id,
      nickname: entry.nickname,
      message: entry.message,
      status: entry.status,
      createdAt: entry.createdAt,
    };
  }

  async updateGuestbookStatus(
    id: string,
    status: GuestbookEntry["status"],
    passwordHash: string,
  ): Promise<GuestbookEntry | null> {
    const index = guestbookEntries.findIndex((entry) => entry.id === id);
    if (index < 0) return null;
    if (guestbookEntries[index].passwordHash !== passwordHash) return null;

    const next = {
      ...guestbookEntries[index],
      status,
    };
    guestbookEntries[index] = next;

    return {
      id: next.id,
      nickname: next.nickname,
      message: next.message,
      createdAt: next.createdAt,
      status: next.status,
    };
  }

  async deleteGuestbookEntry(id: string, passwordHash: string): Promise<boolean> {
    const target = guestbookEntries.find((entry) => entry.id === id);
    if (!target) return false;
    if (target.passwordHash !== passwordHash) return false;

    const next = guestbookEntries.filter((entry) => entry.id !== id);

    guestbookEntries.length = 0;
    guestbookEntries.push(...next);
    return true;
  }

  async createContactMessage(
    input: CreateContactMessageInput,
  ): Promise<ContactMessage> {
    const now = new Date().toISOString();
    const entry: MemoryContact = {
      id: randomUUID(),
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
      status: input.status,
      createdAt: now,
      ipHash: input.ipHash,
      userAgent: input.userAgent,
    };
    contactMessages.push(entry);

    return {
      id: entry.id,
      name: entry.name,
      email: entry.email,
      subject: entry.subject,
      message: entry.message,
      status: entry.status,
      createdAt: entry.createdAt,
    };
  }
}

