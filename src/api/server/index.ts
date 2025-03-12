import { service, spliceUrl } from "../axios";
import { DEFAULT_METHOD } from "../list";
import type { BaseConfig, requestConfig, UrlObj } from "../types";

const myServer = new Function();

/**
 * @method parseRouter
 * @param  {string} name
 * @param  {UrlObj} urlObj
 */
myServer.prototype.parseRouter = function (name: string, urlObj: UrlObj) {
  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  const obj: any = (this[name] = {});
  Object.keys(urlObj).forEach((key) => {
    obj[key] = this.send.bind(this, urlObj[key]);
  });
};

/**
 * @method send
 * @param  {BaseConfig} base
 * @param  {object} config
 * @return {Promise<any>}
 */
myServer.prototype.send = (base: BaseConfig, config: requestConfig) => {
  const {
    method = DEFAULT_METHOD,
    query = "",
    url,
    ...axiosConfig
  } = getRequestConfig(base, config) || {};

  return service({
    ...axiosConfig,
    // baseURL: BASE_URL,
    url: url || spliceUrl(typeof base === "string" ? base : base.target, query),
    method,
  });
};

export default myServer.prototype;

export function getRequestConfig(base: BaseConfig, config?: requestConfig) {
  if (typeof base === "string") {
    return config;
  }
  const { baseConfig, extendUrlSuffix = "" } = base || {};
  const { query, method, params, data } = config || {};

  return {
    ...config,
    ...baseConfig,
    query: (baseConfig.query || "") + (query || "") + (extendUrlSuffix || ""),
    method: method ? method : baseConfig.method,
    params: Object.assign({}, baseConfig.params, params),
    data: Object.assign({}, baseConfig.data, data),
  };
}

export const checkIsAuthorized = () => {
  return !!service.defaults.headers.common.Authorization;
};
