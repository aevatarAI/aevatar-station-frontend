import clsx from "clsx";
import ReactLoading from "react-loading";

export default function PageLoading({ className }: { className?: string }) {
  return (
    <div
      data-testid="page-loading"
      className={clsx(
        "flex items-center justify-center w-full h-full bg-[var(--bg-background)] absolute top-0 left-0 z-50",
        className,
      )}
    >
      <div className="flex text-2xl font-bold text-[var(--color-text-primary)] flex items-center">
        <div className="text-[var(--color-foreground)] font-geist text-lg font-semibold leading-normal text-[18px]">
          Scanning......
        </div>
        <ReactLoading type="bars" color="var(--bg-accent)" />
      </div>
    </div>
  );
}
