"use client";
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";
import Link from "next/link";
import { NotionRenderer } from "react-notion-x";
import dynamic from "next/dynamic";

interface RendererProps {
  recordMap: any; // 임의로 any
  rootPageId: string;
}

export const Renderer = ({ recordMap, rootPageId }: RendererProps) => {
  const Code = dynamic(() =>
    import("react-notion-x/build/third-party/code").then(async (m) => {
      await Promise.all([]);

      return m.Code;
    })
  );
  const Collection = dynamic(() =>
    import("react-notion-x/build/third-party/collection").then((m) => m.Collection)
  );
  const Equation = dynamic(() =>
    import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
  );
  const Pdf = dynamic(() => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf), {
    ssr: false,
  });
  const Modal = dynamic(
    () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
    {
      ssr: false,
    }
  );
  return (
    <div className="notion__container">
      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        darkMode={false}
        rootPageId={rootPageId}
        rootDomain="blog"
        mapPageUrl={(pageId) => `/blog/${pageId}`}
        previewImages
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
          nextLink: Link,
        }}
      />
    </div>
  );
};

export default Renderer;
