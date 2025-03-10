import Loading from "../../assets/loading.svg?react";
import "./index.css";

export default function CardLoading() {
  return (
    <div
      data-testid="card-loading"
      className="flex justify-center items-center h-full">
      <Loading className="aevatarai-loading-icon" />
    </div>
  );
}
