"use client";

import DownIcon from "@/assets/down.svg?react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import "./select.css";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectPrimitiveTrigger: React.ElementType = SelectPrimitive.Trigger;
const SelectPrimitiveIcon: React.ElementType = SelectPrimitive.Icon;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPrimitiveTrigger
      ref={ref}
      className={cn(
        "flex font-pro h-10 w-full items-center justify-center gap-[10px] border border-[#303030] bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        "text-white text-center font-syne text-xs font-semibold leading-normal lowercase",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitiveIcon
        asChild
        className={props["aria-disabled"] ? "hidden" : undefined}
      >
        <DownIcon />
      </SelectPrimitiveIcon>
    </SelectPrimitiveTrigger>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectPrimitiveScrollUpButton: React.ElementType =
  SelectPrimitive.ScrollUpButton;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton> &
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <SelectPrimitiveScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitiveScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectPrimitiveDownButton: React.ElementType =
  SelectPrimitive.ScrollDownButton;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton> &
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <SelectPrimitiveDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitiveDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectPrimitiveContent: React.ElementType = SelectPrimitive.Content;

const SelectPrimitiveViewport: React.ElementType = SelectPrimitive.Viewport;
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> &
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitiveContent
      ref={ref}
      className={cn(
        "relative font-pro z-50  bg-[#141415] text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        " w-[259px] p-[20px] left-[16px]",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitiveViewport
        className={cn(
          position === "popper" && "h-[var(--radix-select-trigger-height)]",
        )}
      >
        {children}
      </SelectPrimitiveViewport>
      <SelectScrollDownButton />
    </SelectPrimitiveContent>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectPrimitiveLabel: React.ElementType = SelectPrimitive.Label;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> &
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <SelectPrimitiveLabel
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectPrimitiveItem: React.ElementType = SelectPrimitive.Item;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> &
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitiveItem
    ref={ref}
    className={cn(
      "relative cursor-pointer select-none items-center text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
      "text-[#B9B9B9] text-center font-syne text-[11px] leading-normal lowercase py-[7px]",
      "select-item-wrapper",
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitiveItem>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectPrimitiveSeparator: React.ElementType = SelectPrimitive.Separator;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> &
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <SelectPrimitiveSeparator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
