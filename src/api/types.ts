import type { AxiosRequestConfig, AxiosResponse } from "axios";

export enum CancelTokenSourceKey {
  GET_PROJECT_DETAIL = "getProjectDetail",
}

export type requestConfig = {
  query?: string; //this for url parameter； example: test/:id
  query1?: string; //this for url parameter； example: /api/:id/test/:query1
  params?: any; // this for url params; example: test?pageIndex=0&pageSize=3
  cancelTokenSourceKey?: CancelTokenSourceKey;
} & AxiosRequestConfig<any>;

export type IBaseRequest = {
  url: string;
} & requestConfig;

export type BaseConfig =
  | string
  | { target: string; baseConfig: requestConfig; extendUrlSuffix?: string };

export type UrlObj = { [key: string]: BaseConfig };

export type API_REQ_FUNCTION<T = any> = (
  config?: requestConfig,
) => Promise<T | AxiosResponse<T>>;
