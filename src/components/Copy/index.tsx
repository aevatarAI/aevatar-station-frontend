import CopyIcon from "@/assets/to_copy.svg?react";
import clsx from "clsx";
import { useCallback } from "react";
import { useCopyToClipboard } from "react-use";

export default function Copy({
  toCopy,
  children,
  className,
  iconClassName,
}: {
  toCopy: string;
  children?: React.ReactNode;
  className?: string;
  iconClassName?: string;
}) {
  const [, setCopied] = useCopyToClipboard();
  const onClick = useCallback(() => {
    setCopied(toCopy);
  }, [setCopied, toCopy]);

  return (
    <span
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onClick();
        }
      }}
      className={clsx("flex-row-center cursor-pointer", className)}>
      <CopyIcon className={iconClassName} />
      {children}
    </span>
  );
}
