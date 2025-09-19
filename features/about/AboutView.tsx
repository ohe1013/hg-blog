"use client";

import { useEffect, useState } from "react";
import Renderer from "@features/notion/Renderer";

export default function AboutView({
  pageId,
  onNavigate,
}: {
  pageId: string;
  onNavigate: (id: string) => void;
}) {
  const [recordMap, setRecordMap] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/notion/page/${pageId}`);
        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        if (!cancelled) {
          setRecordMap(data.recordMap);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (pageId) load();

    return () => {
      cancelled = true;
    };
  }, [pageId]);

  if (loading) return <div style={{ padding: 8 }}>Loading…</div>;
  if (error) return <div style={{ padding: 8, color: "red" }}>{error}</div>;
  if (!recordMap) return null;

  return (
    <Renderer
      onNavigate={onNavigate}
      recordMap={recordMap}
      rootPageId={pageId}
      rootUrl="blog"
    />
  );
}
