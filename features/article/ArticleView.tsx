"use client";

import { useEffect, useState } from "react";
import Renderer from "@features/notion/Renderer";
import { fetchNotionRecordMap } from "@features/notion/api";

export default function ArticleView({
  pageId,
  onNavigate,
  initialRecordMap,
}: {
  pageId: string;
  onNavigate: (id: string) => void;
  initialRecordMap?: any;
}) {
  const [recordMap, setRecordMap] = useState<any | null>(
    initialRecordMap ?? null,
  );
  const [loading, setLoading] = useState(!initialRecordMap);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const map = await fetchNotionRecordMap(pageId);
        if (!cancelled) {
          setRecordMap(map);
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

  if (loading) return <div style={{ padding: 8 }}>Loading...</div>;
  if (error) return <div style={{ padding: 8, color: "red" }}>{error}</div>;
  if (!recordMap) return null;

  return (
    <Renderer
      onNavigate={onNavigate}
      recordMap={recordMap}
      rootPageId={pageId}
      rootUrl="article"
    />
  );
}
