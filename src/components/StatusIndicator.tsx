import StatusIcon from "@/assets/status.svg?react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useInterval } from "usehooks-ts";

export enum Status {
  Running = "running",
  Error = "error",
  NotStarted = "not-started",
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

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.Running:
        return "var(--color-success)";
      case Status.Error:
        return "var(--color-error)";
      case Status.NotStarted:
        return "var(--color-text-secondary)";
      default:
        return "var(--color-text-secondary)";
    }
  };

  const getTextColor = (status: Status) => {
    if (status === Status.NotStarted) {
      return "var(--color-text-secondary)";
    }
    return "var(--color-text-primary)";
  };

  return (
    <div className="flex items-center">
      <StatusIcon
        className={cn({
          "text-transparent": !isOn && status === Status.Error,
        })}
        style={{
          color:
            status === Status.Error && !isOn
              ? "transparent"
              : getStatusColor(status),
        }}
      />
      <span
        className={cn(
          "font-geist text-[13px] font-medium ml-[7px] uppercase",
          "text-[var(--color-text-primary)]",
        )}
        style={{ color: getTextColor(status) }}
      >
        {status === Status.Running
          ? "Running"
          : status === Status.Error
            ? "Error"
            : "Not Started"}
        {message ? (
          <>
            :<br />
            <span>{message}</span>
          </>
        ) : (
          ""
        )}
      </span>
    </div>
  );
}
