"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    checkClassName?: string;
  }
>(({ className, checkClassName, ...props }, ref) => (
  <div className="flex items-center gap-4">
  <CheckboxPrimitive.Root
    ref={ref}
    id={props?.id}
    className={cn(
      "flex bg-white peer h-4 w-4 shrink-0 rounded-sm border border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}>
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current cursor-pointer")}
      >
      <CheckIcon />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
  <label className="text-[11px] text-gray-light font-source-code cursor-pointer" htmlFor={props?.id}>
			{props.name}
		</label>
  </div>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
