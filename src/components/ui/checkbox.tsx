"use client";

import { cn } from "@/lib/utils";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import * as React from "react";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    checkClassName?: string;
    labelClassName?: string;
  }
>(({ className, checkClassName, labelClassName, ...props }, ref) => (
  <div className="flex items-center gap-[10px]">
    <CheckboxPrimitive.Root
      ref={ref}
      id={props?.id}
      className={cn(
        "flex bg-white peer h-4 w-4 shrink-0 rounded-sm border border-primary focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground cursor-pointer",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(
          "flex items-center justify-center text-current cursor-pointer",
        )}
      >
        <CheckIcon className="w-[14px] h-[14px] ml-[-0.5px]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
    <label
      className={clsx(
        " text-gray-light font-outfit cursor-pointer",
        labelClassName,
      )}
      htmlFor={props?.id}
    >
      {props.name}
    </label>
  </div>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
