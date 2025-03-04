/// <reference types="vite-plugin-svgr/client" />

declare module "*&as=metadata" {
	const metadata: {
		width: number;
		height: number;
		src: string;
	};
	export default metadata;
}

declare module "*&as=srcset" {
	const srcset: string;
	export default srcset;
}
