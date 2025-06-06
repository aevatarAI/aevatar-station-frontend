import axios from "axios";

export const isDeniedRequest = (error: { message: string }) => {
  try {
    const message: string = error.message;
    if (message?.includes("401")) return true;
  } catch (error) {
    console.error(error);
  }
  return false;
};

const axiosInstance = axios.create({
  baseURL: "/",
  timeout: 20 * 1000,
});

axiosInstance.defaults.headers.common["x-csrf-token"] = "AUTH_TOKEN";

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data === "Healthy") return response.data;
    const res = response.data;
    if (res?.code?.substring(0, 1) !== "2") {
      return Promise.reject(res);
    }
    return res;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const service = axiosInstance;

export function spliceUrl(baseUrl: string, extendArg?: string) {
  return extendArg ? `${baseUrl}/${extendArg}` : baseUrl;
}
