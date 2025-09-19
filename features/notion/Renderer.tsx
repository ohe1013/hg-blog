"use client";
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";
import Link from "next/link";
import { NotionRenderer } from "react-notion-x";
import dynamic from "next/dynamic";
import Image from "next/image";
import { forwardRef, memo, ReactNode, useCallback, useMemo } from "react";

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

const PageLinkBase = ({
  href,
  id,
  children,
  onNavigate,
  rootUrl,
}: PageLinkProps) => {
  const raw = href ?? id ?? "";
  const next = String(raw).split("/").pop()?.replace(/-/g, "");

  if (!onNavigate || !next) {
    return <Link href={`/${rootUrl}/${raw}`}>{children}</Link>;
  }

  // 렌더 과정의 console.log 제거 (디버그 필요 시 클릭 핸들러 내에서 1회만)
  return (
    <Link
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onNavigate(next);
      }}
    >
      {children}
    </Link>
  );
};
// Renderer.tsx 최상단(컴포넌트 바깥)
const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then((m) => m.Code)
);
const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  { ssr: false }
);
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  { ssr: false }
);

const PageLink = memo(
  forwardRef<HTMLAnchorElement, PageLinkProps>(function PageLink(
    { onNavigate, rootUrl, href, id, children, ...rest },
    ref
  ) {
    const raw = href ?? id ?? "";
    const next = String(raw).split("/").pop()?.replace(/-/g, "");

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
          e.preventDefault();
          onNavigate(next);
        }}
      >
        {children}
      </a>
    );
  })
);
export const Renderer = memo(function Renderer({
  recordMap,
  rootPageId,
  rootUrl,
  onNavigate,
}: RendererProps) {
  const mapPageUrl = useCallback((pageId: string) => `/${pageId}`, []);

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
      nextImage: Image,
      nextLink: Link,
    }),
    [onNavigate, rootUrl]
  );

  return (
    <div className="notion__container">
      <NotionRenderer
        recordMap={recordMap}
        fullPage
        darkMode={false}
        rootPageId={rootPageId}
        mapPageUrl={mapPageUrl}
        previewImages
        components={components}
      />
    </div>
  );
});
export default Renderer;
