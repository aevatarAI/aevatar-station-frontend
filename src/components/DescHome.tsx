import clsx from "clsx";

export default function DescHome({ className }: { className?: string }) {
  return (
    <div className={clsx("gap-5 flex flex-col ", className)}>
      <h1 className=" text-[36px] lg:text-[54px] font-semibold font-syne leading-9 lg:leading-[54px]">
        aevatar.ai
      </h1>
      <p className="text-[var(--muted-foreground)] text-[16px] font-semibold">
        The future of on-chain autonomous intelligence
      </p>
    </div>
  );
}
