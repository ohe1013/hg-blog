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
      await Promise.all([
        import("prismjs/components/prism-markup-templating"),
        import("prismjs/components/prism-markup"),
        import("prismjs/components/prism-bash"),
        import("prismjs/components/prism-c"),
        import("prismjs/components/prism-cpp"),
        import("prismjs/components/prism-csharp"),
        import("prismjs/components/prism-docker"),
        import("prismjs/components/prism-java"),
        import("prismjs/components/prism-js-templates"),
        import("prismjs/components/prism-coffeescript"),
        import("prismjs/components/prism-diff"),
        import("prismjs/components/prism-git"),
        import("prismjs/components/prism-go"),
        import("prismjs/components/prism-graphql"),
        import("prismjs/components/prism-handlebars"),
        import("prismjs/components/prism-less"),
        import("prismjs/components/prism-makefile"),
        import("prismjs/components/prism-markdown"),
        import("prismjs/components/prism-objectivec"),
        import("prismjs/components/prism-ocaml"),
        import("prismjs/components/prism-python"),
        import("prismjs/components/prism-reason"),
        import("prismjs/components/prism-rust"),
        import("prismjs/components/prism-sass"),
        import("prismjs/components/prism-scss"),
        import("prismjs/components/prism-solidity"),
        import("prismjs/components/prism-sql"),
        import("prismjs/components/prism-stylus"),
        import("prismjs/components/prism-swift"),
        import("prismjs/components/prism-wasm"),
        import("prismjs/components/prism-yaml"),
      ]);

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
