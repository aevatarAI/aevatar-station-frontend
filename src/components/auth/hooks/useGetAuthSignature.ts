import { recoverPubKeyBySignature } from "@etransfer/utils";
import { useCallback } from "react";
import { useGetSignature } from "./useGetSignature";

export const useGetAuthSignature = () => {
	const getSignature = useGetSignature();

	return useCallback(
		async (plainTextOrigin: string) => {
			const signatureResult = await getSignature(plainTextOrigin);
			if (!signatureResult) throw Error("Signature error");
			const pubkey = `${recoverPubKeyBySignature(
				signatureResult.plainText,
				signatureResult.signature,
			)}`;

			return {
				pubkey,
				signature: signatureResult.signature,
				plainText: signatureResult.plainText,
			};
		},
		[getSignature],
	);
};
