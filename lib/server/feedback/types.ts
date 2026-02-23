export type GuestbookStatus = "published" | "hidden" | "spam";

export type ContactStatus =
  | "new"
  | "read"
  | "replied"
  | "spam"
  | "archived";

export type GuestbookEntry = {
  id: string;
  nickname: string;
  message: string;
  createdAt: string;
  status: GuestbookStatus;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: ContactStatus;
};

export type GuestbookCreatePayload = {
  nickname: string;
  password: string;
  message: string;
  isSecret?: boolean;
  website?: string;
};

export type ContactCreatePayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
};

export type GuestbookListOptions = {
  limit: number;
  cursor?: string | null;
};

export type GuestbookListResult = {
  items: GuestbookEntry[];
  nextCursor: string | null;
};

export type CreateGuestbookEntryInput = {
  nickname: string;
  passwordHash: string;
  message: string;
  status: GuestbookStatus;
  ipHash: string;
  userAgent: string | null;
};

export type CreateContactMessageInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  ipHash: string;
  userAgent: string | null;
};

export type RequestContext = {
  ip: string;
  userAgent: string | null;
};
