import { WalletTypeEnum } from "@aelf-web-login/wallet-adapter-base";
import { useConnectWallet } from "@aelf-web-login/wallet-adapter-react";
import AElf from "aelf-sdk";
import { useCallback } from "react";
import { APP_NAME } from "../config/walletConnect";

export const useGetSignature = () => {
	const { getSignature, walletType, walletInfo } = useConnectWallet();

	return useCallback(
		async (plainTextOrigin: string) => {
			if (!walletInfo) throw new Error("Failed to obtain wallet information.");

			const plainText: any = Buffer.from(plainTextOrigin)
				.toString("hex")
				.replace("0x", "");
			let signResult: {
				error: number;
				errorMessage: string;
				signature: string;
				from: string;
			} | null;
			if (walletType === WalletTypeEnum.discover) {
				// discover
				const discoverInfo = walletInfo?.extraInfo as any;
				if (
					(discoverInfo?.provider as any).methodCheck(
						"wallet_getManagerSignature",
					)
				) {
					const sign = await discoverInfo?.provider?.request({
						method: "wallet_getManagerSignature",
						payload: { hexData: plainText },
					});
					const signR = sign.r.toString("hex", 32).padStart(64, "0");
					const signS = sign.s.toString("hex", 32).padStart(64, "0");
					const signRecoveryParam = sign.recoveryParam
						.toString()
						.padStart(2, "0");
					const signInfo = [signR, signS, signRecoveryParam].join("");

					signResult = {
						error: 0,
						errorMessage: "",
						signature: signInfo,
						from: WalletTypeEnum.discover,
					};
				} else {
					const signInfo = AElf.utils.sha256(plainText);
					signResult = await getSignature({
						appName: APP_NAME,
						address: walletInfo.address,
						signInfo,
					});
				}
			} else if (walletType === WalletTypeEnum.elf) {
				// nightElf
				const signInfo = AElf.utils.sha256(plainText);
				signResult = await getSignature({
					appName: APP_NAME,
					address: walletInfo.address,
					signInfo,
				});
			} else {
				// portkey sdk
				const signInfo = Buffer.from(plainText).toString("hex");
				signResult = await getSignature({
					appName: APP_NAME,
					address: walletInfo.address,
					signInfo,
				});
			}

			if (signResult?.error) throw signResult.errorMessage;

			return { signature: signResult?.signature || "", plainText };
		},
		[getSignature, walletInfo, walletType],
	);
};
