import { useConnectWallet } from "@aelf-web-login/wallet-adapter-react";
import { useCallback } from "react";
import { getManagerAddressByWallet } from "../utils/wallet";
import { getWalletUserInfo } from "../utils/walletUserInfo";
import { useIsConnected } from "./useIsConnected";

export const useGetWalletUserInfo = () => {
	const { walletType, walletInfo } = useConnectWallet();
	const isConnect = useIsConnected();

	return useCallback(async () => {
		if (!walletInfo) throw new Error("Failed to obtain wallet information.");
		if (!isConnect) throw new Error("You are not logged in.");

		try {
			const { caHash, originChainId } = await getWalletUserInfo(
				walletInfo,
				walletType,
			);
			const managerAddress = await getManagerAddressByWallet(
				walletInfo as any,
				walletType,
			);

			return {
				caHash,
				originChainId,
				managerAddress: managerAddress,
			};
		} catch (error) {
			console.log("useGetWalletUserInfo: error", error);
			throw new Error("Failed to obtain user information");
		}
	}, [isConnect, walletInfo, walletType]);
};
