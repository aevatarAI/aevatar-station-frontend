import TickIcon from "@/assets/tick.svg?react";
import CopyIcon from "@/assets/to_copy.svg?react";
import { toast } from "@/hooks/use-toast";
import clsx from "clsx";
import { useCallback, useState } from "react";
import { useCopyToClipboard } from "react-use";

export default function Copy({
  description,
  toCopy,
  children,
  className,
  iconClassName,
}: {
  description?: string;
  toCopy: string;
  children?: React.ReactNode;
  className?: string;
  iconClassName?: string;
}) {
  const [, setCopied] = useCopyToClipboard();
  const [clicked, setClicked] = useState(false);

  const onClick = useCallback(() => {
    setClicked(true);

    toast({ description });

    const timeoutId = setTimeout(() => {
      setClicked(false);
    }, 2000);

    setCopied(toCopy);

    return () => clearTimeout(timeoutId);
  }, [setCopied, toCopy, description]);

  return (
    <span
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onClick();
        }
      }}
      className={clsx("flex-row-center cursor-pointer", className)}
    >
      {clicked ? (
        <>
          <TickIcon />
        </>
      ) : (
        <CopyIcon className={iconClassName} />
      )}
      {children}
    </span>
  );
}
