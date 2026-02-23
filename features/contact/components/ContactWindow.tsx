"use client";

import { FormEvent, useCallback, useMemo, useRef, useState } from "react";
import Button from "@lib/components/Button";
import { submitContactMessage } from "@features/feedback/api";
import {
  Window,
  WindowBody,
  WindowMenuBar,
  WindowResizeHeader,
  WindowStatus,
} from "@features/window/components";
import { useApplicationStore } from "../../../zustand/application/applicationProvider";

interface ContactWindowProps {
  winId: string;
}

export default function ContactWindow({ winId }: ContactWindowProps) {
  const { getById, close } = useApplicationStore((s) => s);
  const win = getById(winId);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting) return;

      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitMessage(null);

      try {
        await submitContactMessage({
          name,
          email,
          subject,
          message,
          website,
        });

        setSubject("");
        setMessage("");
        setWebsite("");
        setSubmitMessage("Your message has been sent.");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to send message.";
        setSubmitError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, isSubmitting, message, name, subject, website],
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
          {
            label: "Send Message",
            onClick: triggerSubmitFromMenu,
            disabled: isSubmitting,
          },
          { label: "Close", onClick: () => close(winId) },
        ],
      },
      {
        label: "Help",
        key: "help",
        items: [
          { label: "Help Topics", disabled: true },
          { label: "About Contact", disabled: true },
        ],
      },
    ],
    [close, isSubmitting, triggerSubmitFromMenu, winId],
  );

  if (!win) return null;

  return (
    <Window
      winId={winId}
      initialWidth="620px"
      initialHeight="500px"
      initialX="12%"
      initialY="10%"
    >
      <WindowResizeHeader />
      <WindowMenuBar menus={menus} />
      <WindowBody
        style={{
          display: "block",
          flexDirection: "column",
          backgroundColor: "#c0c0c0",
        }}
      >
        <div className="p-3 border-b border-black/20">
          <p className="text-xs leading-4">
            Send a private message. This form is stored in Firebase and is not
            shown publicly.
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto"
        >
          <div className="field-row-stacked">
            <label htmlFor={`contact-name-${winId}`}>Name</label>
            <input
              id={`contact-name-${winId}`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              required
            />
          </div>

          <div className="field-row-stacked">
            <label htmlFor={`contact-email-${winId}`}>Email</label>
            <input
              id={`contact-email-${winId}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={120}
              required
            />
          </div>

          <div className="field-row-stacked">
            <label htmlFor={`contact-subject-${winId}`}>Subject</label>
            <input
              id={`contact-subject-${winId}`}
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={120}
              required
            />
          </div>

          <div className="field-row-stacked">
            <label htmlFor={`contact-message-${winId}`}>Message</label>
            <textarea
              id={`contact-message-${winId}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
              maxLength={2000}
              required
            />
          </div>

          <div style={{ display: "none" }} aria-hidden="true">
            <label htmlFor={`contact-website-${winId}`}>Website</label>
            <input
              id={`contact-website-${winId}`}
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              autoComplete="off"
              tabIndex={-1}
            />
          </div>

          <div className="mt-1 flex items-center justify-end gap-2">
            <Button type="button" onClick={() => close(winId)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send"}
            </Button>
          </div>

          {submitError && <p className="text-xs text-red-700">{submitError}</p>}
          {submitMessage && (
            <p className="text-xs text-green-700">{submitMessage}</p>
          )}
        </form>
      </WindowBody>
      <WindowStatus />
    </Window>
  );
}
