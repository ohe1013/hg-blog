export type GuestbookEntry = {
  id: string;
  nickname: string;
  message: string;
  createdAt: string;
  status: "published" | "hidden" | "spam";
};

export type GuestbookListResponse = {
  items: GuestbookEntry[];
  nextCursor: string | null;
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

type ApiErrorBody = {
  error?: string;
  message?: string;
  details?: string[];
};

async function parseError(res: Response): Promise<string> {
  try {
    const json = (await res.json()) as ApiErrorBody;
    if (json.details?.length) {
      return `${json.message ?? "Request failed"}: ${json.details.join(" ")}`;
    }
    return json.message ?? `Request failed with status ${res.status}`;
  } catch {
    return `Request failed with status ${res.status}`;
  }
}

export async function fetchGuestbookEntries(
  limit = 20,
  cursor?: string | null,
): Promise<GuestbookListResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (cursor) params.set("cursor", cursor);

  const res = await fetch(`/api/guestbook?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return (await res.json()) as GuestbookListResponse;
}

export async function submitGuestbookEntry(
  payload: GuestbookCreatePayload,
): Promise<{ id: string; createdAt: string }> {
  const res = await fetch("/api/guestbook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return (await res.json()) as { id: string; createdAt: string };
}

export async function updateGuestbookEntryStatus(
  id: string,
  status: "hidden" | "published",
  password: string,
): Promise<{ id: string; status: "published" | "hidden" | "spam" }> {
  const res = await fetch(`/api/guestbook/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status, password }),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return (await res.json()) as { id: string; status: "published" | "hidden" | "spam" };
}

export async function deleteGuestbookEntry(
  id: string,
  password: string,
): Promise<{ id: string; deleted: boolean }> {
  const res = await fetch(`/api/guestbook/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return (await res.json()) as { id: string; deleted: boolean };
}

export async function submitContactMessage(
  payload: ContactCreatePayload,
): Promise<{ id: string; createdAt: string }> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return (await res.json()) as { id: string; createdAt: string };
}
