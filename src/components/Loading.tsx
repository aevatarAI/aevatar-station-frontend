import { loadingAtom } from "@/state/atoms";
import { useAtom } from "jotai";
import ReactLoading from "react-loading";

export default function Loading() {
  const [show] = useAtom(loadingAtom);
  if (!show) return null;

  return (
    <div className="flex items-center justify-center w-full h-full bg-[var(--bg-background)] fixed top-0 left-0 z-50">
      <div className="text-2xl font-bold text-[var(--color-text-primary)] flex flex-col lg:flex-row items-center">
        <div className="text-[var(--color-foreground)] text-xl font-semibold font-geist tracking-wide">
          Scanning......
        </div>
        <ReactLoading type="bars" color="var(--bg-accent)" />
      </div>
    </div>
  );
}
