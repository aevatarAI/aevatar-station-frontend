import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { CheckboxProps } from "@radix-ui/react-checkbox";
import clsx from "clsx";

const checkboxLabel =
  "font-normal text-[12px] leading-[14px] mb-0 mt-0! font-geist";
const checkboxCls =
  "border-[var(--color-border-primary)] bg-[var(--bg-muted)]  disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--bg-primary)] data-[state=checked]:border-[var(--color-border-gray-deep)]";

export default function CheckboxLabel({
  text,
  wrapperClassName,
  labelClassName,
  ...props
}: CheckboxProps & {
  text: string;
  wrapperClassName?: string;
  labelClassName?: string;
}) {
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
      <Label className={clsx(checkboxLabel, labelClassName)}>{text}</Label>
    </div>
  );
}
