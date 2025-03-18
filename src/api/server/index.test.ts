import { describe, it, expect, vi, beforeEach } from "vitest";
import myServer, { getRequestConfig } from "./index";
import { service, spliceUrl } from "../axios";
import { DEFAULT_METHOD } from "../list";

vi.mock("../axios", () => ({
  service: vi.fn(),
  spliceUrl: vi.fn((url: string, query: string) => `${url}?${query}`),
}));

vi.mock("../list", () => ({
  DEFAULT_METHOD: "GET",
}));

describe("myServer", () => {
  const mockBaseConfig = {
    target: "/api/test",
    baseConfig: { method: "POST", query: "initialQuery" },
    extendUrlSuffix: "&extraSuffix",
  };

  const mockRequestConfig = {
    query: "mockQuery",
    method: "GET",
    params: { key: "value" },
    data: { id: 1 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("parseRouter", () => {
    it("should bind a function for each key in urlObj", () => {
      const instance: any = Object.create(myServer);

      const urlObj = {
        testEndpoint1: "/endpoint1",
        testEndpoint2: "/endpoint2",
      };

      myServer.parseRouter.call(instance, "api", urlObj);

      expect(instance.api).toBeDefined();
      expect(typeof instance.api.testEndpoint1).toBe("function");
      expect(typeof instance.api.testEndpoint2).toBe("function");
    });

    it("should call the respective send function when endpoint is invoked", () => {
      const instance: any = Object.create(myServer);
      const urlObj = {
        testEndpoint: "/endpoint",
      };
      const sendSpy = vi.spyOn(instance, 'send');

      instance.parseRouter('api', urlObj);
  
      const config = { query: 'testQuery' };
      instance.api.testEndpoint(config);
  
      expect(sendSpy).toHaveBeenCalledWith('/endpoint', config);
    });
  });

  describe("send", () => {
    it("should send a configured request via service", async () => {
      const mockResponse = { data: "mockResponse" };
      (service as any).mockResolvedValueOnce(mockResponse);

      const result = await myServer.send(mockBaseConfig, mockRequestConfig);

      expect(service).toHaveBeenCalledWith({
        method: "GET",
        url: "/api/test?initialQuerymockQuery&extraSuffix",
        params: { key: "value" },
        data: { id: 1 },
      });
      expect(result).toEqual(mockResponse);
    });

    it("should use DEFAULT_METHOD when method is not provided", async () => {
      const mockResponse = { data: "mockResponse" };
      (service as any).mockResolvedValueOnce(mockResponse);

      const baseConfig = {
        ...mockBaseConfig,
        baseConfig: { query: "initialQuery" },
      };
      const requestConfig = { query: "mockQuery", params: { key: "value" } };

      await myServer.send(baseConfig, requestConfig);

      expect(service).toHaveBeenCalledWith(
        expect.objectContaining({
          method: DEFAULT_METHOD,
        })
      );
    });
  });

  describe("getRequestConfig", () => {
    it("should merge baseConfig and requestConfig correctly", () => {
      const baseConfig = {
        target: "/api",
        baseConfig: {
          query: "baseQuery",
          method: "POST",
          params: { baseKey: "baseValue" },
        },
        extendUrlSuffix: "&extraSuffix",
      };
      const requestConfig = {
        query: "requestQuery",
        method: "GET",
        params: { reqKey: "reqValue" },
      };

      const result = getRequestConfig(baseConfig, requestConfig);

      expect(result).toEqual({
        query: "baseQueryrequestQuery&extraSuffix",
        method: "GET",
        params: { baseKey: "baseValue", reqKey: "reqValue" },
        data: undefined,
      });
    });

    it("should return requestConfig if base is a string", () => {
      const result = getRequestConfig("/api/test", mockRequestConfig);

      expect(result).toEqual(mockRequestConfig);
    });
  });
});
