import CopyIcon from "@/assets/copy.svg?react";

interface IWalletDetailProps {
	address: string;
	balance: number;
	balanceUSD: number;
	type: string;
}

export default function WalletDetail({
	address,
	type,
	balance,
	balanceUSD,
}: IWalletDetailProps) {
	return (
		<div className="mb-[28px]">
			<div className="text-white text-[15px] font-semibold font-syne bg-white/40 pt-[5px] pb-[4px] px-[10px] border-l-8 border-white mb-[16px]">
				{type}
			</div>
			<div className="text-white text-sm font-medium font-pro flex gap-2 justify-between m-[10px] ml-[18px]">
				{address} <CopyIcon />
			</div>
			<div className="flex items-center m-[10px] ml-[18px]">
				<div className="text-white text-sm font-medium font-pro mr-[10px]">
					{balance} ELF
				</div>
				<div className="text-[#b9b9b9] text-[11px] font-medium font-pro">
					{balanceUSD} USD
				</div>
			</div>
		</div>
	);
}
