import clsx from "clsx";
import ReactLoading from "react-loading";

export default function ProjectInitialising({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center w-full h-full bg-[var(--bg-background)]",
        className,
      )}
    >
      <div className="text-2xl font-bold text-[var(--color-text-primary)] flex flex-col lg:flex-row items-center">
        <div className="text-[var(--color-foreground)] text-xl font-semibold font-geist tracking-wide">
          initialising workspace......
        </div>
        <ReactLoading type="bars" color="var(--bg-accent)" />
      </div>
    </div>
  );
}
