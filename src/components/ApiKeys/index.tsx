import Plus from "@/assets/+.svg?react";
import { Button } from "@/components/ui/button";
import { textGradient } from "@/constants/cls";
import clsx from "clsx";
export default function ApiKeys() {
  return (
    <div>
      <div className="flex justify-between items-center pb-[28px]">
        <div className={clsx(textGradient)}>api keys</div>
        <Button className="py-[6px] gap-[10px] text-[12px] font-semibold leading-[14px]">
          <Plus />
          <span>create</span>
        </Button>
      </div>
    </div>
  );
}
