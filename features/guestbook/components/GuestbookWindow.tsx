"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Button from "@lib/components/Button";
import {
  GuestbookEntry,
  deleteGuestbookEntry,
  fetchGuestbookEntries,
  submitGuestbookEntry,
  updateGuestbookEntryStatus,
} from "@features/feedback/api";
import {
  Window,
  WindowBody,
  WindowMenuBar,
  WindowResizeHeader,
  WindowStatus,
} from "@features/window/components";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";

interface GuestbookWindowProps {
  winId: string;
}

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export default function GuestbookWindow({ winId }: GuestbookWindowProps) {
  const { getById, close } = useApplicationStore((s) => s);
  const win = getById(winId);

  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSecret, setIsSecret] = useState(false);
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const [actionPasswords, setActionPasswords] = useState<
    Record<string, string>
  >({});
  const [entryActionLoadingId, setEntryActionLoadingId] = useState<
    string | null
  >(null);
  const [entryActionError, setEntryActionError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const result = await fetchGuestbookEntries(20);
      setEntries(result.items);
      setNextCursor(result.nextCursor);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load entries.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const loadMoreEntries = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    setLoadError(null);
    try {
      const result = await fetchGuestbookEntries(20, nextCursor);
      setEntries((prev) => [...prev, ...result.items]);
      setNextCursor(result.nextCursor);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load more entries.";
      setLoadError(message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, nextCursor]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting) return;

      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitMessage(null);

      try {
        await submitGuestbookEntry({
          nickname,
          password,
          message,
          isSecret,
          website,
        });

        setPassword("");
        setMessage("");
        setIsSecret(false);
        setWebsite("");
        setSubmitMessage("Entry added successfully.");
        await loadEntries();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to submit entry.";
        setSubmitError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSecret, isSubmitting, loadEntries, message, nickname, password, website],
  );

  const handlePasswordChange = useCallback((id: string, value: string) => {
    setActionPasswords((prev) => ({
      ...prev,
      [id]: value,
    }));
  }, []);

  const getActionPassword = useCallback(
    (id: string): string | null => {
      const value = actionPasswords[id]?.trim();
      if (!value) {
        setEntryActionError(
          "Enter the entry password before show/hide/delete.",
        );
        return null;
      }
      return value;
    },
    [actionPasswords],
  );

  const handleHide = useCallback(
    async (id: string) => {
      if (entryActionLoadingId) return;
      const targetPassword = getActionPassword(id);
      if (!targetPassword) return;

      setEntryActionLoadingId(id);
      setEntryActionError(null);
      try {
        await updateGuestbookEntryStatus(id, "hidden", targetPassword);
        setActionPasswords((prev) => ({ ...prev, [id]: "" }));
        await loadEntries();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to hide entry.";
        setEntryActionError(message);
      } finally {
        setEntryActionLoadingId(null);
      }
    },
    [entryActionLoadingId, getActionPassword, loadEntries],
  );

  const handleShow = useCallback(
    async (id: string) => {
      if (entryActionLoadingId) return;
      const targetPassword = getActionPassword(id);
      if (!targetPassword) return;

      setEntryActionLoadingId(id);
      setEntryActionError(null);
      try {
        await updateGuestbookEntryStatus(id, "published", targetPassword);
        setActionPasswords((prev) => ({ ...prev, [id]: "" }));
        await loadEntries();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to show entry.";
        setEntryActionError(message);
      } finally {
        setEntryActionLoadingId(null);
      }
    },
    [entryActionLoadingId, getActionPassword, loadEntries],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (entryActionLoadingId) return;
      const targetPassword = getActionPassword(id);
      if (!targetPassword) return;

      setEntryActionLoadingId(id);
      setEntryActionError(null);
      try {
        await deleteGuestbookEntry(id, targetPassword);
        setActionPasswords((prev) => ({ ...prev, [id]: "" }));
        await loadEntries();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete entry.";
        setEntryActionError(message);
      } finally {
        setEntryActionLoadingId(null);
      }
    },
    [entryActionLoadingId, getActionPassword, loadEntries],
  );

  const triggerSubmitFromMenu = useCallback(() => {
    formRef.current?.requestSubmit();
  }, []);

  const menus = useMemo(
    () => [
      {
        label: "File",
        key: "file",
        items: [
          { label: "Refresh", onClick: loadEntries },
          { label: "Close", onClick: () => close(winId) },
        ],
      },
      {
        label: "Guestbook",
        key: "guestbook",
        items: [
          {
            label: "Submit Entry",
            onClick: triggerSubmitFromMenu,
            disabled: isSubmitting,
          },
          {
            label: "Load More",
            onClick: loadMoreEntries,
            disabled: !nextCursor || isLoadingMore,
          },
        ],
      },
    ],
    [
      close,
      isLoadingMore,
      isSubmitting,
      loadEntries,
      loadMoreEntries,
      nextCursor,
      triggerSubmitFromMenu,
      winId,
    ],
  );

  if (!win) return null;

  return (
    <Window
      winId={winId}
      initialWidth="700px"
      initialHeight="560px"
      initialX="8%"
      initialY="8%"
    >
      <WindowResizeHeader />
      <WindowMenuBar menus={menus} />
      <WindowBody
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#c0c0c0",
        }}
      >
        <div className="p-2 border-b border-black/20">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-2"
          >
            <div className="field-row-stacked">
              <label htmlFor={`guestbook-nickname-${winId}`}>Nickname</label>
              <input
                id={`guestbook-nickname-${winId}`}
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Your nickname"
                maxLength={24}
                required
              />
            </div>

            <div className="field-row-stacked">
              <label htmlFor={`guestbook-password-${winId}`}>Password</label>
              <input
                id={`guestbook-password-${winId}`}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password for hide/delete"
                maxLength={64}
                required
              />
            </div>

            <div className="field-row-stacked">
              <label htmlFor={`guestbook-message-${winId}`}>Message</label>
              <textarea
                id={`guestbook-message-${winId}`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                maxLength={500}
                required
              />
            </div>

            <div style={{ display: "none" }} aria-hidden="true">
              <label htmlFor={`guestbook-website-${winId}`}>Website</label>
              <input
                id={`guestbook-website-${winId}`}
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                autoComplete="off"
                tabIndex={-1}
              />
            </div>

            <input
              type="checkbox"
              id="secret"
              checked={isSecret}
              onChange={(e) => setIsSecret(e.target.checked)}
            />
            <label htmlFor="secret" className="flex items-center gap-2 text-xs">
              비밀글로 등록
            </label>

            <div className="flex items-center justify-end gap-2">
              <Button type="button" onClick={loadEntries} disabled={isLoading}>
                Refresh
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Sign Guestbook"}
              </Button>
            </div>
          </form>

          {submitError && (
            <p className="text-xs text-red-700 mt-2">{submitError}</p>
          )}
          {submitMessage && (
            <p className="text-xs text-green-700 mt-2">{submitMessage}</p>
          )}
          {loadError && (
            <p className="text-xs text-red-700 mt-2">{loadError}</p>
          )}
          {entryActionError && (
            <p className="text-xs text-red-700 mt-2">{entryActionError}</p>
          )}
        </div>

        <div
          className="flex-1 overflow-y-auto p-2"
          style={{ backgroundColor: "#c0c0c0" }}
        >
          {isLoading ? (
            <p className="text-xs">Loading guestbook entries...</p>
          ) : entries.length === 0 ? (
            <div className="sunken-panel p-2 bg-white">
              <p className="text-xs">No guestbook entries yet.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {entries.map((entry) => (
                <li key={entry.id} className="sunken-panel p-2 bg-white">
                  <div className="flex items-start justify-between gap-2 text-xs">
                    <strong>{entry.nickname}</strong>
                    <div className="text-right">
                      <div>{formatDate(entry.createdAt)}</div>
                      {entry.status === "hidden" && (
                        <div className="text-amber-700">secret</div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm mt-1 whitespace-pre-wrap break-words">
                    {entry.message}
                  </p>

                  <div className="mt-2 flex flex-col gap-1">
                    <input
                      type="password"
                      value={actionPasswords[entry.id] ?? ""}
                      onChange={(e) =>
                        handlePasswordChange(entry.id, e.target.value)
                      }
                      placeholder="Password to hide/delete this entry"
                      maxLength={64}
                    />
                    <div className="flex justify-end gap-1">
                      {entry.status === "published" && (
                        <Button
                          onClick={() => handleHide(entry.id)}
                          disabled={entryActionLoadingId === entry.id}
                        >
                          Hide
                        </Button>
                      )}
                      {entry.status === "hidden" && (
                        <Button
                          onClick={() => handleShow(entry.id)}
                          disabled={entryActionLoadingId === entry.id}
                        >
                          Show
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDelete(entry.id)}
                        disabled={entryActionLoadingId === entry.id}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!isLoading && nextCursor && (
            <div className="mt-2 flex justify-center">
              <Button onClick={loadMoreEntries} disabled={isLoadingMore}>
                {isLoadingMore ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      </WindowBody>
      <WindowStatus />
    </Window>
  );
}
