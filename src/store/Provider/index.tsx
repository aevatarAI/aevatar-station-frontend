import ReduxProvider from "./ReduxProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function ContextProviders({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <ReduxProvider>{children}</ReduxProvider>
    </ErrorBoundary>
  );
}
