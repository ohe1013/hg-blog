"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Button from "@lib/components/Button";
import {
  ArticleComment,
  deleteArticleComment,
  fetchArticleComments,
  submitArticleComment,
  updateArticleCommentStatus,
} from "@features/feedback/api";

interface ArticleCommentsPanelProps {
  pageId: string;
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

export default function ArticleCommentsPanel({
  pageId,
}: ArticleCommentsPanelProps) {
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
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

  const loadComments = useCallback(async () => {
    if (!pageId) return;

    setIsLoading(true);
    setLoadError(null);

    try {
      const result = await fetchArticleComments(pageId, 20);
      setComments(result.items);
      setNextCursor(result.nextCursor);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load comments.";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const loadMoreComments = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    setLoadError(null);

    try {
      const result = await fetchArticleComments(pageId, 20, nextCursor);
      setComments((prev) => [...prev, ...result.items]);
      setNextCursor(result.nextCursor);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load more comments.";
      setLoadError(message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, nextCursor, pageId]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting) return;

      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitMessage(null);

      try {
        await submitArticleComment({
          articlePageId: pageId,
          nickname,
          password,
          message,
          website,
        });

        setPassword("");
        setMessage("");
        setWebsite("");
        setSubmitMessage("Comment posted.");
        await loadComments();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to submit comment.";
        setSubmitError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, loadComments, message, nickname, pageId, password, website],
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
        setEntryActionError("Enter the comment password before show/hide/delete.");
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
        await updateArticleCommentStatus(id, "hidden", targetPassword);
        setActionPasswords((prev) => ({ ...prev, [id]: "" }));
        await loadComments();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to hide comment.";
        setEntryActionError(message);
      } finally {
        setEntryActionLoadingId(null);
      }
    },
    [entryActionLoadingId, getActionPassword, loadComments],
  );

  const handleShow = useCallback(
    async (id: string) => {
      if (entryActionLoadingId) return;
      const targetPassword = getActionPassword(id);
      if (!targetPassword) return;

      setEntryActionLoadingId(id);
      setEntryActionError(null);
      try {
        await updateArticleCommentStatus(id, "published", targetPassword);
        setActionPasswords((prev) => ({ ...prev, [id]: "" }));
        await loadComments();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to show comment.";
        setEntryActionError(message);
      } finally {
        setEntryActionLoadingId(null);
      }
    },
    [entryActionLoadingId, getActionPassword, loadComments],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (entryActionLoadingId) return;
      const targetPassword = getActionPassword(id);
      if (!targetPassword) return;

      setEntryActionLoadingId(id);
      setEntryActionError(null);
      try {
        await deleteArticleComment(id, targetPassword);
        setActionPasswords((prev) => ({ ...prev, [id]: "" }));
        await loadComments();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete comment.";
        setEntryActionError(message);
      } finally {
        setEntryActionLoadingId(null);
      }
    },
    [entryActionLoadingId, getActionPassword, loadComments],
  );

  return (
    <section className="px-6 pb-6 pt-3 border-t border-black/20">
      <h2 className="text-base font-semibold">Comments</h2>

      <form className="mt-2 flex flex-col gap-2" onSubmit={handleSubmit}>
        <div className="field-row-stacked">
          <label htmlFor={`comment-nickname-${pageId}`}>Nickname</label>
          <input
            id={`comment-nickname-${pageId}`}
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Your nickname"
            maxLength={24}
            required
          />
        </div>

        <div className="field-row-stacked">
          <label htmlFor={`comment-password-${pageId}`}>Password</label>
          <input
            id={`comment-password-${pageId}`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password for hide/delete"
            maxLength={64}
            required
          />
        </div>

        <div className="field-row-stacked">
          <label htmlFor={`comment-message-${pageId}`}>Message</label>
          <textarea
            id={`comment-message-${pageId}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={500}
            required
          />
        </div>

        <div style={{ display: "none" }} aria-hidden="true">
          <label htmlFor={`comment-website-${pageId}`}>Website</label>
          <input
            id={`comment-website-${pageId}`}
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            autoComplete="off"
            tabIndex={-1}
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" onClick={loadComments} disabled={isLoading}>
            Refresh
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Post"}
          </Button>
        </div>
      </form>

      {submitError && <p className="text-xs text-red-700 mt-2">{submitError}</p>}
      {submitMessage && (
        <p className="text-xs text-green-700 mt-2">{submitMessage}</p>
      )}
      {loadError && <p className="text-xs text-red-700 mt-2">{loadError}</p>}
      {entryActionError && (
        <p className="text-xs text-red-700 mt-2">{entryActionError}</p>
      )}

      <div className="mt-3">
        {isLoading ? (
          <p className="text-xs">Loading comments...</p>
        ) : comments.length === 0 ? (
          <div className="sunken-panel p-2 bg-white">
            <p className="text-xs">No comments yet.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {comments.map((comment) => (
              <li key={comment.id} className="sunken-panel p-2 bg-white">
                <div className="flex items-start justify-between gap-2 text-xs">
                  <strong>{comment.nickname}</strong>
                  <div className="text-right">
                    <div>{formatDate(comment.createdAt)}</div>
                    {comment.status === "hidden" && (
                      <div className="text-amber-700">hidden</div>
                    )}
                  </div>
                </div>
                <p className="text-sm mt-1 whitespace-pre-wrap break-words">
                  {comment.message}
                </p>

                <div className="mt-2 flex flex-col gap-1">
                  <input
                    type="password"
                    value={actionPasswords[comment.id] ?? ""}
                    onChange={(e) =>
                      handlePasswordChange(comment.id, e.target.value)
                    }
                    placeholder="Password to hide/show/delete this comment"
                    maxLength={64}
                  />
                  <div className="flex justify-end gap-1">
                    {comment.status === "published" && (
                      <Button
                        onClick={() => handleHide(comment.id)}
                        disabled={entryActionLoadingId === comment.id}
                      >
                        Hide
                      </Button>
                    )}
                    {comment.status === "hidden" && (
                      <Button
                        onClick={() => handleShow(comment.id)}
                        disabled={entryActionLoadingId === comment.id}
                      >
                        Show
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDelete(comment.id)}
                      disabled={entryActionLoadingId === comment.id}
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
            <Button onClick={loadMoreComments} disabled={isLoadingMore}>
              {isLoadingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

