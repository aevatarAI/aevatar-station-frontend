import type {
	TWalletInfo,
	WalletTypeEnum,
} from "@aelf-web-login/wallet-adapter-base";

export const ACCESS_TOKEN_KEY = "ACCESS_TOKEN";

export type TJWTData = {
	access_token: string;
	expires_in: number;
	token_type: string;
};
const Day = 1 * 24 * 60 * 60 * 1000;
export type TLocalJWTData = {
	expiresTime?: number;
} & TJWTData;
export const getLocalJWT = (key: string) => {
	try {
		const localData = localStorage.getItem(ACCESS_TOKEN_KEY);
		if (!localData) return;
		const data = JSON.parse(localData) as { [key: string]: TLocalJWTData };
		const cData = data[key];
		if (!cData || !cData?.expiresTime) return;
		if (Date.now() - 0.5 * Day > cData?.expiresTime) return;
		return cData;
	} catch (error) {
		console.log("getLocalJWT error", error);
		return;
	}
};

export const setLocalJWT = (key: string, data: TLocalJWTData) => {
	const localData: TLocalJWTData = {
		...data,
		expiresTime: Date.now() + (data.expires_in - 10) * 1000,
	};
	return localStorage.setItem(
		ACCESS_TOKEN_KEY,
		JSON.stringify({ [key]: localData }),
	);
};

export const clearLocalJWT = () => {
	return localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const getLocalJWTKey = (
	walletInfo: TWalletInfo,
	walletType: WalletTypeEnum,
) => {
	if (!walletInfo || !walletType) return "";
	return `${walletType}_${walletInfo.address}`;
};
