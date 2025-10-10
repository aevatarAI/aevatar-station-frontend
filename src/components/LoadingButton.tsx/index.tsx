import Loading from "@/assets/loading.svg?react";
import { Button, type ButtonProps } from "@/components/ui/button";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function LoadingButton({
  className,
  children,
  onClick,
  onLoadingChange,
  ...props
}: Omit<ButtonProps, "onClick"> & {
  onLoadingChange?: (loading: boolean) => void;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => Promise<void>;
}) {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  useEffect(() => {
    onLoadingChange?.(btnLoading);
  }, [btnLoading, onLoadingChange]);

  return (
    <Button
      {...props}
      className={clsx(
        btnLoading &&
          "bg-[var(--bg-primary)] text-[var(--primary-foreground)] py-[7px] leading-[14px]",
        className,
      )}
      onClick={async (e) => {
        setBtnLoading(true);
        await onClick?.(e);
        setBtnLoading(false);
      }}
    >
      {btnLoading && (
        <Loading
          className={clsx("aevatarai-loading-icon")}
          style={{ width: 14, height: 14 }}
        />
      )}
      {children}
    </Button>
  );
}
