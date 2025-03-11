import { IS_TESTNET } from "./config";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  queryParams?: Record<string, string | number>;
};

export const fetcher = async <T = any>(
  url: string,
  options: FetchOptions = {},
  mockdata?: T,
): Promise<T> => {
  const { method = "GET", headers = {}, body, queryParams } = options;
  const queryString = queryParams
    ? `?${new URLSearchParams(
        Object.entries(queryParams).map(([key, value]) => [key, String(value)]),
      ).toString()}`
    : "";

  // if `URLSearchParams`, don't use `JSON.stringify()`
  const isFormEncoded =
    headers["Content-Type"] === "application/x-www-form-urlencoded";
  const requestBody = isFormEncoded ? body : JSON.stringify(body);

  const response = await fetch(url + queryString, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? requestBody : undefined,
  });

  if (!response.ok) {
    const errorMessage = `Error: ${response.status} ${response.statusText}`;
    console.error(errorMessage);
    if (IS_TESTNET && mockdata) {
      return mockdata;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};
