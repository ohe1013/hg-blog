"use client";
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";
import Link from "next/link";
import { NotionRenderer } from "react-notion-x";
import dynamic from "next/dynamic";
import Image from "next/image";
import { forwardRef, memo, ReactNode, useCallback, useMemo } from "react";

/**
 * Notion API (notion-client) sometimes returns blocks in a nested format:
 * block[id] = { spaceId, value: { role, value: Block } }
 * react-notion-x expects the standard format:
 * block[id] = { role, value: Block }
 * This function flattens the nested structure to prevent crashes.
 */
function normalizeRecordMap(recordMap: any) {
  if (!recordMap || typeof recordMap !== "object" || Array.isArray(recordMap))
    return recordMap;

  // Categories that typically have the { value, role } structure
  const categories = [
    "block",
    "collection",
    "collection_view",
    "notion_user",
    "space",
  ];
  let hasOverallChange = false;
  const newRecordMap = { ...recordMap };

  categories.forEach((cat) => {
    if (!recordMap[cat] || typeof recordMap[cat] !== "object") return;

    const items = recordMap[cat];
    const newItems = { ...items };
    let hasCatChange = false;

    Object.keys(items).forEach((id) => {
      const itemRecord = items[id];
      // Standard structure: { value: { id, ... }, role: '...' }
      // Abnormal structure: { value: { value: { id, ... }, role: '...' }, ... }
      if (itemRecord?.value?.value && !itemRecord.value.id) {
        newItems[id] = {
          ...itemRecord.value,
          value: itemRecord.value.value,
          role: itemRecord.value.role || itemRecord.role,
        };
        hasCatChange = true;
      }
    });

    if (hasCatChange) {
      newRecordMap[cat] = newItems;
      hasOverallChange = true;
    }
  });

  return hasOverallChange ? newRecordMap : recordMap;
}

interface RendererProps {
  recordMap: any;
  rootPageId: string;
  rootUrl: string;
  onNavigate?: (id: string) => void; // ← 추가
}
type PageLinkProps = {
  href?: string;
  id?: string;
  children?: ReactNode;
  onNavigate?: (id: string) => void;
  rootUrl: string;
};

// Renderer.tsx 최상단(컴포넌트 바깥)
const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then((m) => m.Code),
);
const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection,
  ),
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation),
);
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  { ssr: false },
);
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  { ssr: false },
);

const PageLink = memo(
  forwardRef<HTMLAnchorElement, PageLinkProps>(function PageLink(
    { onNavigate, rootUrl, href, id, children, ...rest },
    ref,
  ) {
    const raw = href ?? id ?? "";
    const next =
      typeof raw === "string" ? raw.split("/").pop()?.replace(/-/g, "") : "";

    // onNavigate 없으면 원래대로 링크 이동: Notion이 준 className 등 그대로 전달
    if (!onNavigate || !next) {
      return (
        <Link href={`/${rootUrl}/${raw}`} ref={ref as any} {...rest}>
          {children}
        </Link>
      );
    }

    // 내부 네비게이션: 여전히 <a>에 props를 모두 유지해서 CSS가 적용되게 함
    return (
      <a
        ref={ref}
        href={`/${rootUrl}/${raw}`}
        {...rest} // ★ className, style, data-*, aria-*, target, rel 등 보존
        onClick={(e) => {
          console.log("click");
          e.preventDefault();
          onNavigate(next);
          // 만약 rest에도 onClick이 있다면 그것도 실행해줌
          if (typeof (rest as any).onClick === "function") {
            (rest as any).onClick(e);
          }
        }}
      >
        {children}
      </a>
    );
  }),
);

export const Renderer = memo(function Renderer({
  recordMap,
  rootPageId,
  rootUrl,
  onNavigate,
}: RendererProps) {
  const mapPageUrl = useCallback(
    (pageId: string) => {
      const base = rootUrl ? `/${rootUrl}` : "";
      return `${pageId}`;
    },
    [rootUrl],
  );

  const components = useMemo(
    () => ({
      Code,
      Collection,
      Equation,
      Modal,
      Pdf,
      PageLink: (props: any) => (
        <PageLink {...props} onNavigate={onNavigate} rootUrl={rootUrl} />
      ),
      nextImage: (props: any) => {
        const alt = props.alt || "Article image";
        return <Image {...props} alt={alt} />;
      },
      nextLink: Link,
    }),
    [onNavigate, rootUrl],
  );

  const normalizedRecordMap = useMemo(
    () => normalizeRecordMap(recordMap),
    [recordMap],
  );

  return (
    <div className="notion__container">
      <NotionRenderer
        recordMap={normalizedRecordMap}
        fullPage
        darkMode={false}
        rootPageId={rootPageId}
        mapPageUrl={mapPageUrl}
        previewImages={false}
        components={components}
      />
    </div>
  );
});
export default Renderer;
