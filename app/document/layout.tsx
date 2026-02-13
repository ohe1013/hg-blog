import DocumentClientLayout from "./ClientDocumentLayout";
import { EXPLORER_ROOT } from "@features/explorer/data";

export default function DocumentLayout() {
  return <DocumentClientLayout winId={EXPLORER_ROOT.document} />;
}
