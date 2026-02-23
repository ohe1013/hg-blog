import {
  ContactMessage,
  CreateContactMessageInput,
  CreateGuestbookEntryInput,
  GuestbookEntry,
  GuestbookListOptions,
  GuestbookListResult,
} from "../types";

export interface FeedbackRepository {
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
