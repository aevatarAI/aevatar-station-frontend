import * as React from "react";

import { cn } from "@//lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, value = "", ...props }, ref) => {
    return (
      <input
        type={type}
        value={value}
        className={cn(
          "flex h-10 w-full text-[13px] font-geist border border-[var(--color-input)] bg-[var(--bg-background)] px-[18px] py-[10px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-hidden",
          className,
          {
            "border-destructive": props["aria-invalid"],
          },
        )}
        ref={ref}
        autoComplete="off"
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
