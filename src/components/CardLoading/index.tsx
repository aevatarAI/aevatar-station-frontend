import clsx from "clsx";
import Loading from "../../assets/loading.svg?react";
import "./index.css";

export default function CardLoading({ className }: { className?: string }) {
  return (
    <div
      data-testid="card-loading"
      className={clsx("flex justify-center items-center h-full", className)}
    >
      <Loading className="aevatarai-loading-icon" />
    </div>
  );
}
