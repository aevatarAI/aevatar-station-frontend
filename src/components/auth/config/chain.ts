import {
	NetworkEnum,
	type TChainId,
} from "@aelf-web-login/wallet-adapter-base";

export const NETWORK_TYPE = import.meta.env.VITE_APP_NETWORKTYPE;
export const IS_TESTNET = NETWORK_TYPE === NetworkEnum.TESTNET;
export const IS_MAINNET = NETWORK_TYPE === NetworkEnum.MAINNET;

export const ChainIdMap: { [x in TChainId]: string } = {
	AELF: "9992731",
	tDVV: "1866392",
	tDVW: "1931928",
};

interface IChainConfig {
	chainId: TChainId;
	sideChainId: TChainId;
	portkeyCA: string;
	mainChainRpcUrl: string;
	sideChainRpcUrl: string;
	portkeyGraphqlServer: string;
	portkeyConnectServer: string;
	portkeyServiceServer: string;
}

export const CHAIN_CONFIG_TESTNET: IChainConfig = {
	chainId: "AELF" as TChainId,
	sideChainId: "tDVW" as TChainId,
	portkeyCA: "238X6iw1j8YKcHvkDYVtYVbuYk2gJnK8UoNpVCtssynSpVC8hb",
	mainChainRpcUrl: "https://aelf-test-node.aelf.io",
	sideChainRpcUrl: "https://tdvw-test-node.aelf.io",
	portkeyGraphqlServer:
		"https://test-indexer-api.aefinder.io/api/app/graphql/portkey",
	portkeyConnectServer: "https://auth-aa-portkey-test.portkey.finance",
	portkeyServiceServer: "https://aa-portkey-test.portkey.finance",
};

export const CHAIN_CONFIG_MAINNET: IChainConfig = {
	chainId: "AELF" as TChainId,
	sideChainId: "tDVV" as TChainId,
	portkeyCA: "2UthYi7AHRdfrqc1YCfeQnjdChDLaas65bW4WxESMGMojFiXj9",
	portkeyGraphqlServer:
		"https://indexer-api.aefinder.io/api/app/graphql/portkey",
	portkeyConnectServer: "https://auth-aa-portkey.portkey.finance",
	portkeyServiceServer: "https://aa-portkey.portkey.finance",
	mainChainRpcUrl: "https://aelf-public-node.aelf.io",
	sideChainRpcUrl: "https://tdvv-public-node.aelf.io",
};

export const ChainConfig = IS_TESTNET
	? CHAIN_CONFIG_TESTNET
	: CHAIN_CONFIG_MAINNET;
