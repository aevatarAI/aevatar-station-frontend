import { NetworkEnum } from "@aelf-web-login/wallet-adapter-base";
import { ChainConfig } from "./chain";

// Portkey
const NETWORK_TYPE: NetworkEnum =
	(import.meta as any).env.VITE_APP_NETWORKTYPE ?? NetworkEnum.MAINNET;
const GRAPHQL_SERVER = ChainConfig.portkeyGraphqlServer;
const CONNECT_SERVER = ChainConfig.portkeyConnectServer;
const SERVICE_SERVER = ChainConfig.portkeyServiceServer;

const PORTKEY_CONFIG = {
	NETWORK_TYPE,
	GRAPHQL_SERVER,
	CONNECT_SERVER,
	SERVICE_SERVER,
};

export { PORTKEY_CONFIG };
