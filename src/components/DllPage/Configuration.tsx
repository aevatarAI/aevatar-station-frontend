import RestartIcon from "@/assets/restart.svg?react";
import { Button } from "@/components/ui/button";

export default function Configuration({
  onRestart,
}: {
  onRestart?: () => void;
}) {
  return (
    <div
      className="flex flex-row items-center justify-between gap-[42px] w-full px-0 py-0 mb-[34px]"
      style={{ minHeight: 44 }}
    >
      <span className="font-geist font-semibold text-[18px] leading-[1.2] text-left">
        Configuration
      </span>
      <Button
        variant="primary"
        className="group flex flex-row items-center gap-[5px] px-[18px] py-[8px] border border-[var(--color-border-black-light)] font-geist text-[13px] leading-[1.2]"
        onClick={onRestart}
      >
        <RestartIcon className="w-[14px]! h-[14px]! group-hover:text-[var(--primary-foreground)]" />
        <span className="font-geist font-semibold text-[13px] leading-[1.2] text-center">
          Restart services
        </span>
      </Button>
    </div>
  );
}
