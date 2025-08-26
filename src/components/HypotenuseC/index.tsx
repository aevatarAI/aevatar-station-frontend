import Hypotenuse from "@/assets/hypotenuse.svg?react";
import clsx from "clsx";
import "./index.css";
export default function HypotenuseC({
  className,
  emptyClassName,
  hypotenuseClassName,
}: {
  className?: string;
  emptyClassName?: string;
  hypotenuseClassName?: string;
}) {
  return (
    <div className={clsx("h-[14px] relative flex ", className)}>
      <div className={clsx("bg-[#141415] flex-1", emptyClassName)} />
      <Hypotenuse
        className={clsx(
          "w-[17px] h-[14px] text-[#141415]",
          hypotenuseClassName,
        )}
      />
    </div>
  );
}
