import { loadingAtom } from "@//state/atoms";
import { WalletTypeEnum } from "@aelf-web-login/wallet-adapter-base";
import { useConnectWallet } from "@aelf-web-login/wallet-adapter-react";
import { useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import myEvents from "../utils/event";
import {
	clearLocalJWT,
	getLocalJWT,
	getLocalJWTKey,
	setLocalJWT,
} from "../utils/jwt";
import { useGetAuthSignature } from "./useGetAuthSignature";
import { useGetWalletUserInfo } from "./useGetWalletUserInfo";
import { useIsConnected } from "./useIsConnected";

export enum AuthTokenSource {
	Portkey = "portkey",
	NightElf = "nightElf",
}

export const useAuthToken = () => {
	const { walletType, walletInfo, disConnectWallet } = useConnectWallet();
	const isConnected = useIsConnected();
	const [loading, setLoading] = useAtom(loadingAtom);

	const getAuthSignature = useGetAuthSignature();
	const getUserInfo = useGetWalletUserInfo();

	const isSignedRef = useRef(false);
	const getAuthToken = useCallback(async () => {
		if (!walletInfo) throw new Error("Failed to obtain wallet information.");
		if (!isConnected) throw new Error("You are not logged in.");
		if (loading) return;
		setLoading(true);

		try {
			const { caHash, originChainId } = await getUserInfo();
			const key = getLocalJWTKey(walletInfo, walletType);

			const localJWT = getLocalJWT(key);
			// local storage has JWT token
			if (localJWT) {
				isSignedRef.current = true;
				return;
			}

			const plainTextOrigin = `Hello and welcome! Click "Sign" to begin exploring the aevatar dashboard. Rest assured, this action won't trigger any blockchain transactions or incur gas fees.
Nonce: ${Date.now()}`;
			const { pubkey, signature, plainText } =
				await getAuthSignature(plainTextOrigin);
			const source =
				walletType === WalletTypeEnum.elf
					? AuthTokenSource.NightElf
					: AuthTokenSource.Portkey;

			const apiData = {
				pubkey,
				signature,
				plain_text: plainText,
				ca_hash: caHash,
				chain_id: originChainId,
				source,
				client_id: "AevatarAuthServer",
				grant_type: "signature",
			};

			const fetchRes = await fetch("/connect/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams(apiData).toString(),
			});
			const data = await fetchRes.json();

			setLocalJWT(key, data);
			isSignedRef.current = true;
			myEvents.AuthorizationUpdated.emit();
		} catch (error) {
			disConnectWallet();
			throw error || new Error("Failed to obtain authorization.");
		} finally {
			setLoading(false);
		}
	}, [
		disConnectWallet,
		getAuthSignature,
		getUserInfo,
		isConnected,
		walletInfo,
		walletType,
		loading,
		setLoading,
	]);
	const getAuthTokenRef = useRef(getAuthToken);
	getAuthTokenRef.current = getAuthToken;

	// useEffect(() => {
	//   if (!isConnected) return;
	//   getAuthTokenRef.current();
	// }, [isConnected]);

	useEffect(() => {
		const { remove } = myEvents.AuthorizationExpired.addListener(() => {
			console.log("DeniedRequest");
			if (!isSignedRef.current) return;
			clearLocalJWT();
			getAuthTokenRef.current();
		});
		return () => {
			remove();
		};
	}, []);

	return { getAuthToken };
};
