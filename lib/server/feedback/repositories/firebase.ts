import "server-only";
import { Timestamp } from "firebase-admin/firestore";
import { getFirebaseFirestore } from "@lib/server/firebaseAdmin";
import { ConfigurationError } from "../errors";
import {
  ContactMessage,
  CreateContactMessageInput,
  CreateGuestbookEntryInput,
  GuestbookEntry,
  GuestbookListOptions,
  GuestbookListResult,
} from "../types";
import { FeedbackRepository } from "./types";

const COLLECTIONS = {
  guestbook: "guestbook_entries",
  contact: "contact_messages",
} as const;
const HIDDEN_MESSAGE = "비밀처리 된 글입니다.";

function isMissingIndexError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const message = String((error as { message?: unknown }).message ?? "");
  const code = Number((error as { code?: unknown }).code);

  return (
    code === 9 ||
    message.includes("requires an index") ||
    message.includes("FAILED_PRECONDITION")
  );
}

function mapFirestoreError(error: unknown): ConfigurationError | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  const message = String((error as { message?: unknown }).message ?? "");
  const reason = String((error as { reason?: unknown }).reason ?? "");
  const domain = String((error as { domain?: unknown }).domain ?? "");
  const code = Number((error as { code?: unknown }).code);

  const firestoreDisabled =
    reason === "SERVICE_DISABLED" ||
    message.includes("Cloud Firestore API has not been used") ||
    (code === 7 &&
      domain === "googleapis.com" &&
      message.toUpperCase().includes("PERMISSION_DENIED"));

  if (firestoreDisabled) {
    return new ConfigurationError(
      "Cloud Firestore API is disabled for this Firebase project. Enable firestore.googleapis.com and retry in a few minutes.",
    );
  }

  return null;
}

function toGuestbookEntry(doc: {
  id: string;
  data: () => Record<string, unknown>;
}): GuestbookEntry {
  const data = doc.data();
  return {
    id: doc.id,
    nickname: String(data.nickname ?? ""),
    message: String(data.message ?? ""),
    createdAt: toIsoTimestamp(data.createdAt),
    status: (data.status ?? "published") as GuestbookEntry["status"],
  };
}

function toPublicGuestbookEntry(entry: GuestbookEntry): GuestbookEntry {
  if (entry.status !== "hidden") {
    return entry;
  }
  return {
    ...entry,
    message: HIDDEN_MESSAGE,
  };
}

function toIsoTimestamp(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value && typeof value === "object" && "toDate" in value) {
    const asTimestamp = value as { toDate: () => Date };
    return asTimestamp.toDate().toISOString();
  }

  return new Date().toISOString();
}

export class FirebaseFeedbackRepository implements FeedbackRepository {
  private readonly db = getFirebaseFirestore();

  private async listVisibleGuestbookWithIndex(
    options: GuestbookListOptions,
  ): Promise<GuestbookListResult> {
    const baseCollection = this.db.collection(COLLECTIONS.guestbook);
    let query = baseCollection
      .where("status", "in", ["published", "hidden"])
      .orderBy("createdAt", "desc")
      .limit(options.limit + 1);

    if (options.cursor) {
      const cursorSnapshot = await baseCollection.doc(options.cursor).get();
      if (cursorSnapshot.exists) {
        query = query.startAfter(cursorSnapshot);
      }
    }

    const snapshot = await query.get();
    const docs = snapshot.docs;
    const hasNext = docs.length > options.limit;
    const pageDocs = hasNext ? docs.slice(0, options.limit) : docs;
    const items = pageDocs.map((doc) => toPublicGuestbookEntry(toGuestbookEntry(doc)));

    return {
      items,
      nextCursor:
        hasNext && items.length > 0 ? items[items.length - 1]!.id : null,
    };
  }

  // Fallback path for projects that haven't created the composite index yet.
  private async listVisibleGuestbookWithoutCompositeIndex(
    options: GuestbookListOptions,
  ): Promise<GuestbookListResult> {
    const baseCollection = this.db.collection(COLLECTIONS.guestbook);
    const fetchLimit = Math.min(options.limit * 10 + 10, 200);

    let query = baseCollection.orderBy("createdAt", "desc").limit(fetchLimit);
    if (options.cursor) {
      const cursorSnapshot = await baseCollection.doc(options.cursor).get();
      if (cursorSnapshot.exists) {
        query = query.startAfter(cursorSnapshot);
      }
    }

    const snapshot = await query.get();
    const visibleEntries = snapshot.docs
      .map(toGuestbookEntry)
      .filter((entry) => entry.status !== "spam")
      .map(toPublicGuestbookEntry);

    const hasNext = visibleEntries.length > options.limit;
    const pageItems = hasNext
      ? visibleEntries.slice(0, options.limit)
      : visibleEntries;

    return {
      items: pageItems,
      nextCursor:
        hasNext && pageItems.length > 0
          ? pageItems[pageItems.length - 1]!.id
          : null,
    };
  }

  async listGuestbook(options: GuestbookListOptions): Promise<GuestbookListResult> {
    try {
      return await this.listVisibleGuestbookWithIndex(options);
    } catch (error) {
      if (isMissingIndexError(error)) {
        return this.listVisibleGuestbookWithoutCompositeIndex(options);
      }
      throw mapFirestoreError(error) ?? error;
    }
  }

  async createGuestbookEntry(
    input: CreateGuestbookEntryInput,
  ): Promise<GuestbookEntry> {
    try {
      const docRef = this.db.collection(COLLECTIONS.guestbook).doc();
      const createdAt = Timestamp.now();

      await docRef.set({
        nickname: input.nickname,
        passwordHash: input.passwordHash,
        message: input.message,
        status: input.status,
        createdAt,
        ipHash: input.ipHash,
        userAgent: input.userAgent,
      });

      return {
        id: docRef.id,
        nickname: input.nickname,
        message: input.message,
        status: input.status,
        createdAt: createdAt.toDate().toISOString(),
      };
    } catch (error) {
      throw mapFirestoreError(error) ?? error;
    }
  }

  async updateGuestbookStatus(
    id: string,
    status: GuestbookEntry["status"],
    passwordHash: string,
  ): Promise<GuestbookEntry | null> {
    try {
      const docRef = this.db.collection(COLLECTIONS.guestbook).doc(id);
      const currentSnapshot = await docRef.get();
      if (!currentSnapshot.exists) {
        return null;
      }
      const currentData = (currentSnapshot.data() ?? {}) as Record<string, unknown>;
      if (String(currentData.passwordHash ?? "") !== passwordHash) {
        return null;
      }

      await docRef.update({
        status,
      });

      const updatedSnapshot = await docRef.get();
      if (!updatedSnapshot.exists) {
        return null;
      }
      return toGuestbookEntry({
        id: updatedSnapshot.id,
        data: () => (updatedSnapshot.data() ?? {}) as Record<string, unknown>,
      });
    } catch (error) {
      throw mapFirestoreError(error) ?? error;
    }
  }

  async deleteGuestbookEntry(id: string, passwordHash: string): Promise<boolean> {
    try {
      const docRef = this.db.collection(COLLECTIONS.guestbook).doc(id);
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        return false;
      }
      const data = (snapshot.data() ?? {}) as Record<string, unknown>;
      if (String(data.passwordHash ?? "") !== passwordHash) {
        return false;
      }

      await docRef.delete();
      return true;
    } catch (error) {
      throw mapFirestoreError(error) ?? error;
    }
  }

  async createContactMessage(
    input: CreateContactMessageInput,
  ): Promise<ContactMessage> {
    try {
      const docRef = this.db.collection(COLLECTIONS.contact).doc();
      const createdAt = Timestamp.now();

      await docRef.set({
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        status: input.status,
        createdAt,
        ipHash: input.ipHash,
        userAgent: input.userAgent,
      });

      return {
        id: docRef.id,
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        status: input.status,
        createdAt: createdAt.toDate().toISOString(),
      };
    } catch (error) {
      throw mapFirestoreError(error) ?? error;
    }
  }
}
