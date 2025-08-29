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
      <div className="text-[var(--color-foreground)] text-[14px] font-semibold font-outfit pt-[5px] pb-[4px] px-[10px] border-l-8 border-white mb-[16px]">
        {type}
      </div>
      <div className="text-[var(--color-foreground)] text-sm font-medium font-outfit flex gap-2 justify-between m-[10px] ml-[18px]">
        {address} <CopyIcon />
      </div>
      <div className="flex items-center m-[10px] ml-[18px]">
        <div className="text-[var(--color-foreground)] text-sm font-medium font-outfit mr-[10px]">
          {balance} ELF
        </div>
        <div className="text-[var(--muted-foreground)] text-[12px] font-medium font-outfit">
          {balanceUSD} USD
        </div>
      </div>
    </div>
  );
}
