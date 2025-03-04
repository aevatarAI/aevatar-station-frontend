import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import profileImg from "@/assets/profile.png";
import { clearLocalJWT } from "@/components/auth/utils/jwt";
import { useConnectWallet } from "@aelf-web-login/wallet-adapter-react";
import WalletDetail from "./WalletDetail";
import { Button } from "./ui/button";
import { useNavigate } from "@/hooks/navigate";

export default function Profile() {
  const { disConnectWallet, walletInfo } = useConnectWallet();
  const navigate = useNavigate();
  return (
    <div className="border-4 border-white rounded-[2px] w-[28px] h-[28px] bg-white">
      <Popover>
        <PopoverTrigger>
          <img src={profileImg} alt="profile" className="object-cover" />
        </PopoverTrigger>
        <PopoverContent>
          <WalletDetail
            address={walletInfo?.address || "--"}
            balance={123}
            balanceUSD={12.3}
            type="aelf Mainchain"
          />
          <WalletDetail
            address={walletInfo?.address || "--"}
            balance={123}
            balanceUSD={12.3}
            type="aelf dAppChain"
          />
          <Button
            className="w-full border-[#B9B9B9] mt-[12px]"
            onClick={async () => {
              clearLocalJWT();
              await disConnectWallet();
              navigate("/");
            }}>
            Log out
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
