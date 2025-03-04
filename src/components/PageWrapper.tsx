import InfoIcon from "@/assets/info.svg?react";
import type React from "react";

interface IPageWrapperProps extends React.PropsWithChildren {
	title: React.ReactNode;
}

export default function PageWrapper({ children, title }: IPageWrapperProps) {
	return (
		<div className="flex flex-col flex-grow">
			<div className="p-[42px] w-full h-full flex flex-col">
				<div className="flex justify-between">
					<h1 className="uppercase text-lg font-semibold font-syne mb-[49px]">
						{title}
					</h1>
					<a
						className="text-white font-pro text-xs flex"
						href="https://aevatar.ai/docs"
						target="_blank"
						rel="noopener noreferrer"
					>
						<span className="hidden sm:block">information</span>{" "}
						<InfoIcon className="ml-[5px] cursor-pointer" />
					</a>
				</div>
				{children}
			</div>
		</div>
	);
}
