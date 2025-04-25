import { MAX_REQUEST } from "@/api/constants";
import myEvents from "@/utils/myEvent";
import { sleep } from "@etransfer/utils";
import { isDeniedRequest, service, spliceUrl } from "../axios";
import { DEFAULT_METHOD } from "../list";
import type { BaseConfig, UrlObj, requestConfig } from "../types";

const myServer = new Function();
myServer.prototype.tokenPending = false;
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
myServer.prototype.send = async function (
  base: BaseConfig,
  config: requestConfig,
  count = 0,
) {
  const {
    method = DEFAULT_METHOD,
    query = "",
    url,
    ...axiosConfig
  } = getRequestConfig(base, config) || {};
  try {
    const result = await service({
      ...axiosConfig,
      // baseURL: BASE_URL,
      url:
        url || spliceUrl(typeof base === "string" ? base : base.target, query),
      method,
    });
    return result;
  } catch (error: any) {
    if (isDeniedRequest(error) && localStorage.getItem("refresh_token")) {
      const _count = count + 1;
      if (_count > 3) {
        myEvents.AuthorizationExpired.emit(MAX_REQUEST);
        return;
      }
      if (!this.tokenPending) {
        this.tokenPending = true;
        myEvents.AuthorizationExpired.emit();
      }
      const token: string = await new Promise((resolve) => {
        const { remove } = myEvents.AuthorizationUpdated.addListener(
          (data: { error?: any; token?: string }) => {
            if (data.token) resolve(data.token);
            remove();
          }
        );
      });
      this.tokenPending = false;
      service.defaults.headers.Authorization = token;
      return this.send(base, config, _count);
    }
    throw error;
  }
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
    data:
      baseConfig.data || data
        ? Object.assign({}, baseConfig.data, data)
        : undefined,
  };
}
