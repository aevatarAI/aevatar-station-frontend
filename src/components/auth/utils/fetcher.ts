import { getLocalJWT } from "./jwt";

function updateOptions(id: string, options?: RequestInit) {
	const update = { ...(options || {}) };
	const jwt = getLocalJWT(id);

	if (jwt) {
		update.headers = {
			...update.headers,
			Authorization: `${jwt.token_type} ${jwt.access_token}`,
		};
	}
	return update;
}

export default function fetcher(
	url: string | URL | globalThis.Request,
	id: string,
	options?: RequestInit,
) {
	return fetch(url, updateOptions(id, options));
}
