import clsx from "clsx";
import ReactLoading from "react-loading";

export default function PageLoading({ className }: { className?: string }) {
  return (
    <div
      data-testid="page-loading"
      className={clsx(
        "flex items-center justify-center w-full h-full bg-black absolute top-0 left-0 z-50",
        className,
      )}
    >
      <div className="flex text-2xl font-bold text-gray-800 flex items-center">
        <div className="text-white font-outfit text-lg font-semibold leading-normal lowercase text-[18px]">
          Scanning......
        </div>
        <ReactLoading type="bars" color="rgba(255, 255, 255, 0.20)" />
      </div>
    </div>
  );
}
