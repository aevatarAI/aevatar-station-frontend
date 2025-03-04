export default function InfoBox({ children }: React.PropsWithChildren) {
	return (
		<div className="text-center text-white text-xs font-normal font-pro border border-[#303030] px-[20px] py-[10px]">
			{children}
		</div>
	);
}
