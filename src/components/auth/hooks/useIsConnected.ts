import { useConnectWallet } from "@aelf-web-login/wallet-adapter-react";
import { useMemo } from "react";

export const useIsConnected = () => {
	const { walletInfo } = useConnectWallet();
	return useMemo(() => !!walletInfo, [walletInfo]);
};
