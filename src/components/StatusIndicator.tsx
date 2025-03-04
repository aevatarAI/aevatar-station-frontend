import StatusIcon from "@/assets/status.svg?react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useInterval } from "usehooks-ts";

export enum Status {
	Running = "text-[#53FF8A]",
	Error = "text-[#FF2E2E]",
	NotStarted = "text-[#B9B9B9]",
}

export default function StatusIndicator({
	status,
	message,
}: {
	status: Status;
	message?: string;
}) {
	const [isOn, setIsOn] = useState(true);

	useInterval(() => {
		if (status === Status.Error) {
			setIsOn((isOn) => !isOn);
		}
	}, 200);

	return (
		<div className="flex items-center">
			<StatusIcon
				className={cn({
					[Status.Running]: status === Status.Running,
					[Status.Error]: isOn && status === Status.Error,
					"text-transparent": !isOn && status === Status.Error,
					[Status.NotStarted]: status === Status.NotStarted,
				})}
			/>
			<span
				className={cn("font-pro text-[12px] font-medium ml-[7px] uppercase", {
					"text-white": status !== Status.NotStarted,
					[Status.NotStarted]: status === Status.NotStarted,
				})}
			>
				{status === Status.Running
					? "Running"
					: status === Status.Error
						? "Error"
						: "Not Started"}
				{message ? (
					<>
						:<br />
						<span className="lowercase">{message}</span>
					</>
				) : (
					""
				)}
			</span>
		</div>
	);
}
