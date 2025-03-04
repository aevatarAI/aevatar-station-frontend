import { loadingAtom } from "@/state/atoms";
import { useAtom } from "jotai";
import ReactLoading from "react-loading";

export default function Loading() {
	const [show] = useAtom(loadingAtom);
	if (!show) return null;

	return (
		<div className="flex items-center justify-center w-full h-full bg-black fixed top-0 left-0 z-50">
			<div className="text-2xl font-bold text-gray-800 flex flex-col lg:flex-row items-center">
				<div className="text-white text-xl font-semibold font-syne tracking-wide">
					Scanning......
				</div>
				<ReactLoading type="bars" color="rgba(255, 255, 255, 0.20)" />
			</div>
		</div>
	);
}
