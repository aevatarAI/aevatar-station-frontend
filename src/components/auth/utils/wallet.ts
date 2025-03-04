import {
	type TChainId,
	WalletTypeEnum,
} from "@aelf-web-login/wallet-adapter-base";
import { recoverManagerAddressByPubkey } from "@etransfer/utils";
import type { Accounts, IPortkeyProvider } from "@portkey/provider-types";
import type { GetCAHolderByManagerParams, Maybe } from "@portkey/services";

interface ExtraInfoForDiscover {
	accounts: Accounts;
	nickName: string;
	provider: IPortkeyProvider;
	portkeyInfo: any;
}

type TAelfAccounts = {
	AELF?: string;
	tDVV?: string;
	tDVW?: string;
};

interface ExtraInfoForNightElf {
	publicKey: string;
	nightElfInfo: {
		name: string;
	};
}

interface WalletInfo {
	name?: string;
	address: string;
	extraInfo: ExtraInfoForDiscover | ExtraInfoForNightElf;
}

export const getManagerAddressByWallet = async (
	walletInfo: WalletInfo,
	walletType: WalletTypeEnum,
	pubkey?: string,
): Promise<string> => {
	if (walletType === WalletTypeEnum.unknown) return "";

	let managerAddress: string | undefined | null;
	if (
		walletType === WalletTypeEnum.discover ||
		walletType === WalletTypeEnum.web
	) {
		const discoverInfo = walletInfo?.extraInfo as ExtraInfoForDiscover;
		managerAddress = (await discoverInfo?.provider?.request({
			method: "wallet_getCurrentManagerAddress",
		})) as any;
	} else {
		// WalletTypeEnum.elf
		managerAddress = walletInfo.address;
	}

	if (!managerAddress && pubkey) {
		managerAddress = recoverManagerAddressByPubkey(pubkey);
	}

	return managerAddress || "";
};
interface WalletInfo {
	portkeyInfo?: {
		caInfo?: {
			caHash?: string;
		};
	};
}
export const getCaHashAndOriginChainIdByWallet = async (
	walletInfo: WalletInfo,
	walletType: WalletTypeEnum,
): Promise<{
	caHash: string;
	originChainId: TChainId;
}> => {
	if (walletType === WalletTypeEnum.unknown)
		return {
			caHash: "",
			originChainId: "AELF",
		};

	let caHash: Maybe<string> | undefined;
	let originChainId: TChainId | undefined;
	if (!walletInfo?.address) throw "Please login";
	if (
		walletType === WalletTypeEnum.discover ||
		walletType === WalletTypeEnum.web
	) {
		caHash = (walletInfo as WalletInfo)?.portkeyInfo?.caInfo?.caHash;
		if (!caHash) {
			const res = (await (
				walletInfo.extraInfo as ExtraInfoForDiscover
			).provider?.request({
				method: "caHash",
			})) as { caHash: string }[];
			const caInfo = res[0];
			caHash = caInfo?.caHash;
		}

		originChainId = localStorage.getItem("PortkeyOriginChainId") as TChainId;
	}
	return {
		caHash: caHash || "",
		originChainId: originChainId || "AELF",
	};
};
