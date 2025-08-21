import clsx from "clsx";
import ReactLoading from "react-loading";

export default function ProjectInitialising({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center w-full h-full bg-black",
        className,
      )}
    >
      <div className="text-2xl font-bold text-gray-800 flex flex-col lg:flex-row items-center">
        <div className="text-white text-xl font-semibold font-outfit tracking-wide lowercase">
          initialising workspace......
        </div>
        <ReactLoading type="bars" color="rgba(255, 255, 255, 0.20)" />
      </div>
    </div>
  );
}
