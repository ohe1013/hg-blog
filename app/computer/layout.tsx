import ComputerClientLayout from "./ClientComputerLayout";
import { EXPLORER_ROOT } from "@features/explorer/data";

export default function ComputerLayout() {
  return <ComputerClientLayout winId={EXPLORER_ROOT.computer} />;
}
