"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@//lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-[12px] text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const Tooltip = ({
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) => {
  const { isMobile } = useIsMobile();
  const [open, setOpen] = React.useState(false);

  if (isMobile) {
    return (
      <TooltipPrimitive.Root open={open} onOpenChange={setOpen} {...props}>
        {React.Children.map(children, (child) => {
          if (
            React.isValidElement(child) &&
            (child.type === TooltipPrimitive.Trigger ||
              child.type === TooltipTrigger)
          ) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                setOpen(true);
              },
            });
          }
          return child;
        })}
      </TooltipPrimitive.Root>
    );
  }
  return <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>;
};

const TooltipContentCls =
  "z-1000 max-w-[200px] text-[12px] font-geist p-[4px] " +
  "whitespace-pre-wrap break-words text-left border-none";

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipContentCls,
};
