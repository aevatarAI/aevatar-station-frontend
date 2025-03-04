import ReactErrorBoundary, {
  ErrorBoundaryTrue,
} from "@/components/ErrorBoundary/errorBoundary";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { type ReactNode, useCallback, useMemo } from "react";

export type ErrorBoundaryProps = {
  children: ReactNode;
};

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      fallback={({ resetError }) => {
        return (
          <div className={clsx("error-body-popup", "error-body", "flex")}>
            <div className="flex-column-center">
              {/* <CustomSvg type="ErrorIcon" /> */}
              <div className="tip">
                {
                  "Oops! Looks like something went wrong. But don't worry, your wallet and funds are safe and sound."
                }
              </div>
            </div>
            <div className="btn-wrap">
              <Button onClick={resetError}>Reload</Button>
            </div>
          </div>
        );
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
