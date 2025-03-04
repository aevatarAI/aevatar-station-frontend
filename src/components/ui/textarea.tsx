import * as React from "react";

import { cn } from "@//lib/utils";

const Textarea = React.forwardRef<
	HTMLTextAreaElement,
	React.ComponentProps<"textarea">
>(({ className, rows = 3, ...props }, ref) => {
	return (
		<textarea
			className={cn(
				"flex min-h-[80px] resize-none font-pro text-[12px] w-full border border-input bg-background px-[18px] py-[10px] ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
				className,
				{
					"border-destructive": props["aria-invalid"],
				},
			)}
			rows={rows}
			ref={ref}
			{...props}
		/>
	);
});
Textarea.displayName = "Textarea";

export { Textarea };
