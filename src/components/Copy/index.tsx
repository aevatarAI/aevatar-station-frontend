import { useCopyToClipboard } from "react-use";
import clsx from "clsx";
import { useCallback } from "react";
import CopyIcon from "@/assets/copy.svg?react";

export default function Copy({
  toCopy,
  children,
  className,
}: {
  toCopy: string;
  children?: React.ReactNode;
  className?: string;
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
      <CopyIcon />
      {children}
    </span>
  );
}
