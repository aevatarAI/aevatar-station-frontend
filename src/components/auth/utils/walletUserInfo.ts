import type {
	TWalletInfo,
	WalletTypeEnum,
} from "@aelf-web-login/wallet-adapter-base";
import { getCaHashAndOriginChainIdByWallet } from "./wallet";

export const WALLET_USER_INFO_STORE_KEY = "WALLET_USER_INFO_STORE_KEY";

export type TWalletUserInfo = {
	address: string;
	caHash: string;
	originChainId: string;
};
export const getStoreWalletUserInfo = () => {
	try {
		const infoStr = localStorage.getItem(WALLET_USER_INFO_STORE_KEY);
		const info: TWalletUserInfo = JSON.parse(infoStr || "");
		return info;
	} catch (error) {
		return undefined;
	}
};

export const setStoreWalletUserInfo = (info: TWalletUserInfo) => {
	try {
		localStorage.setItem(WALLET_USER_INFO_STORE_KEY, JSON.stringify(info));
	} catch (error) {
		console.log("setStoreWalletUserInfo error", error);
	}
};

export const getWalletUserInfo = async (
	walletInfo: TWalletInfo,
	walletType: WalletTypeEnum,
) => {
	if (!walletInfo)
		throw new Error("Failed to obtain wallet information: getWalletUserInfo");
	const address = walletInfo.address;
	const info = getStoreWalletUserInfo();
	if (info && info.address === address) return info;

	const { caHash, originChainId } = await getCaHashAndOriginChainIdByWallet(
		walletInfo as unknown as any,
		walletType,
	);
	const _info: TWalletUserInfo = {
		address,
		caHash,
		originChainId,
	};
	setStoreWalletUserInfo(_info);
	return _info;
};
