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

export interface FeedbackRepository {
  listArticleComments(
    options: ArticleCommentListOptions,
  ): Promise<ArticleCommentListResult>;
  createArticleComment(
    input: CreateArticleCommentInput,
  ): Promise<ArticleComment>;
  updateArticleCommentStatus(
    id: string,
    status: "hidden" | "published",
    passwordHash: string,
  ): Promise<ArticleComment | null>;
  deleteArticleComment(id: string, passwordHash: string): Promise<boolean>;
  listGuestbook(options: GuestbookListOptions): Promise<GuestbookListResult>;
  createGuestbookEntry(
    input: CreateGuestbookEntryInput,
  ): Promise<GuestbookEntry>;
  updateGuestbookStatus(
    id: string,
    status: GuestbookEntry["status"],
    passwordHash: string,
  ): Promise<GuestbookEntry | null>;
  deleteGuestbookEntry(id: string, passwordHash: string): Promise<boolean>;
  createContactMessage(
    input: CreateContactMessageInput,
  ): Promise<ContactMessage>;
}
