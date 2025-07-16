import { MAX_REQUEST } from "@/api/constants";
import { isSupportConfigUrl } from "@/constants";
import myEvents from "@/utils/myEvent";
import { isDeniedRequest, service, spliceUrl } from "../axios";
import { DEFAULT_METHOD } from "../list";
import type { BaseConfig, UrlObj, requestConfig } from "../types";

const myServer = new Function();
myServer.prototype.tokenPending = false;
// Throttle request cache, key: unique request key, value: { promise, timestamp }
myServer.prototype._pendingRequests = new Map();
// Throttle window in milliseconds
myServer.prototype._throttleWindow = 500; // ms

function stableStringify(obj: any): string {
  // Simple stable serialization, ensure key order
  if (obj === null || typeof obj !== "object") return String(obj);
  if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(",")}]`;
  return `{${Object.keys(obj)
    .sort()
    .map((k) => `${k}:${stableStringify(obj[k])}`)
    .join(",")}}`;
}

function getRequestKey(method: string, url: string, params: any, data: any) {
  return `${method}|${url}|${stableStringify(params)}|${stableStringify(data)}`;
}

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
  // Generate unique key for request
  let requestUrl =
    url || spliceUrl(typeof base === "string" ? base : base.target, query);
  console.log(requestUrl, base, config, "requestUrl==");
  const requestKey = getRequestKey(
    method,
    requestUrl,
    axiosConfig.params,
    axiosConfig.data,
  );
  const now = Date.now();
  // Throttle logic
  const pending = this._pendingRequests.get(requestKey);
  if (pending && now - pending.timestamp < this._throttleWindow) {
    return pending.promise;
  }
  if (isSupportConfigUrl) {
    const serverUrl = localStorage.getItem("serverUrl") ?? "";
    const domainName = localStorage.getItem("projectDomainName") ?? "";
    const serverAllUrl =
      serverUrl && domainName ? `${serverUrl}/${domainName}-client` : "";
    requestUrl = requestUrl.startsWith("http")
      ? requestUrl
      : `${serverAllUrl}${requestUrl}`;
  }
  // Create request Promise
  const reqPromise = (async () => {
    try {
      const result = await service({
        ...axiosConfig,
        url: requestUrl,
        method,
      });
      return result;
    } catch (error: any) {
      if (isDeniedRequest(error) && localStorage.getItem("refresh_token")) {
        const _count = count + 1;
        if (_count > 3) {
          myEvents.AuthorizationExpired.emit(MAX_REQUEST);
          this._pendingRequests.delete(requestKey);
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
            },
          );
        });
        this.tokenPending = false;
        service.defaults.headers.Authorization = token;
        this._pendingRequests.delete(requestKey);
        return this.send(base, config, _count);
      }
      this._pendingRequests.delete(requestKey);
      throw error;
    } finally {
      // Remove cache after request finished (success or error)
      setTimeout(() => {
        this._pendingRequests.delete(requestKey);
      }, this._throttleWindow);
    }
  })();
  this._pendingRequests.set(requestKey, {
    promise: reqPromise,
    timestamp: now,
  });
  return reqPromise;
};

export default myServer.prototype;

export function getRequestConfig(base: BaseConfig, config?: requestConfig) {
  if (typeof base === "string") {
    return config;
  }
  const { baseConfig, extendUrlSuffix = "" } = base || {};
  const { query, method, params, data, query1 } = config || {};
  console.log(config, "config=getRequestConfig");
  return {
    ...config,
    ...baseConfig,
    query:
      (baseConfig.query || "") +
      (query || "") +
      (extendUrlSuffix || "") +
      (query1 ? `/${query1}` : ""),
    method: method ? method : baseConfig.method,
    params: Object.assign({}, baseConfig.params, params),
    data:
      baseConfig.data || data
        ? Object.assign({}, baseConfig.data, data)
        : undefined,
  };
}
