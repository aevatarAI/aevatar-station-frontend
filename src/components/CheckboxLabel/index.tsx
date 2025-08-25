import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { CheckboxProps } from "@radix-ui/react-checkbox";
import clsx from "clsx";

const checkboxLabel =
  "font-normal text-[12px] leading-[14px] mb-0 mt-0! font-outfit";
const checkboxCls =
  "border-[#989DA0] bg-white  disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-deep data-[state=checked]:border-gray-deep";

export default function CheckboxLabel({
  text,
  wrapperClassName,
  ...props
}: CheckboxProps & { text: string; wrapperClassName?: string }) {
  return (
    <div
      className={clsx(
        "flex items-center gap-[8px] py-[14px]",
        wrapperClassName,
      )}
    >
      <Checkbox
        {...props}
        className={clsx(checkboxCls, "w-[14px] h-[14px]", props.className)}
        checkClassName="w-[14px]! h-[14px]!"
      />
      <Label className={checkboxLabel}>{text}</Label>
    </div>
  );
}
