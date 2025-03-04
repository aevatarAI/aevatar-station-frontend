import { walletConnectConfig } from "@/components/auth/config/walletConnect";
import { WebLoginProvider } from "@aelf-web-login/wallet-adapter-react";

const WebProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<WebLoginProvider config={walletConnectConfig}>{children}</WebLoginProvider>
	);
};

export default WebProvider;
