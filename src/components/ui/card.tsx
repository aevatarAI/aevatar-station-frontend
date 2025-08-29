import * as React from "react";

import { cn } from "@//lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border text-card-foreground shadow-2xs cutCorner",
      "bg-[var(--color-bg-primary)] border-[var(--color-border-primary)]",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 mt-[15px] mx-[20px] mb-[16px]",
      className,
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-[14px] font-semibold leading-none tracking-tight font-outfit mb-[7px]",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "font-outfit text-[13px] text-[var(--color-text-secondary)]",
      className,
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "pt-[34px] pb-[26px] pl-[28px] pr-[35px] flex flex-col gap-[25px]",
      className,
    )}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-[20px] border-t-2", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

const CardFooterFixedHeight = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <CardFooter
    ref={ref}
    className={cn("h-[267px] overflow-y-auto items-start", className)}
    {...props}
  >
    <div className="w-full overflow-y-auto">{children}</div>
  </CardFooter>
));
CardFooterFixedHeight.displayName = "CardFooterFixedHeight";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooterFixedHeight,
};
