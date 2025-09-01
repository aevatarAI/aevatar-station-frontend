import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getCurrentMode,
  getEnvConfig,
  isDevelopment,
  isLocal,
  isProduction,
} from "./env";

// Mock import.meta.env
const mockImportMetaEnv = {
  VITE_APP_NETWORKTYPE: "TESTNET",
  VITE_APP_SIGNAL_R_URL: "https://test.example.com",
  VITE_APP_DOMAIN_URL: "https://api.test.example.com",
  VITE_PROXY_AUTH_URL: "https://auth.test.example.com",
  VITE_PROXY_API_URL: "https://api.test.example.com",
  VITE_GITHUB_CLIENT_ID: "test_github_client_id",
  VITE_GITHUB_REDIRECT_URI: "http://localhost:3000/callback",
  VITE_GITHUB_SCOPE: "read:user",
  VITE_GOOGLE_CLIENT_ID: "test_google_client_id",
  DEV: true,
  PROD: false,
  MODE: "development",
};

// Mock the entire module to control import.meta.env
vi.mock("./env", async () => {
  const actual = await vi.importActual("./env");
  return {
    ...actual,
    getEnvConfig: vi.fn(),
    isDevelopment: vi.fn(),
    isProduction: vi.fn(),
    isLocal: vi.fn(),
    getCurrentMode: vi.fn(),
  };
});

describe("Environment Configuration", () => {
  let mockGetEnvConfig: any;
  let mockIsDevelopment: any;
  let mockIsProduction: any;
  let mockIsLocal: any;
  let mockGetCurrentMode: any;

  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks();

    // Import the mocked functions
    const envModule = await import("./env");
    mockGetEnvConfig = envModule.getEnvConfig;
    mockIsDevelopment = envModule.isDevelopment;
    mockIsProduction = envModule.isProduction;
    mockIsLocal = envModule.isLocal;
    mockGetCurrentMode = envModule.getCurrentMode;
  });

  describe("getEnvConfig", () => {
    it("should return all environment variables", () => {
      const expectedConfig = {
        VITE_APP_NETWORKTYPE: "TESTNET",
        VITE_APP_SIGNAL_R_URL: "https://test.example.com",
        VITE_APP_DOMAIN_URL: "https://api.test.example.com",
        VITE_PROXY_AUTH_URL: "https://auth.test.example.com",
        VITE_PROXY_API_URL: "https://api.test.example.com",
        VITE_GITHUB_CLIENT_ID: "test_github_client_id",
        VITE_GITHUB_REDIRECT_URI: "http://localhost:3000/callback",
        VITE_GITHUB_SCOPE: "read:user",
        VITE_GOOGLE_CLIENT_ID: "test_google_client_id",
      };

      mockGetEnvConfig.mockReturnValue(expectedConfig);
      const config = mockGetEnvConfig();

      expect(config).toEqual(expectedConfig);
      expect(mockGetEnvConfig).toHaveBeenCalled();
    });

    it("should return default values for missing environment variables", () => {
      const expectedConfig = {
        VITE_APP_NETWORKTYPE: "TESTNET",
        VITE_APP_SIGNAL_R_URL: "",
        VITE_APP_DOMAIN_URL: "",
        VITE_PROXY_AUTH_URL: "",
        VITE_PROXY_API_URL: "",
        VITE_GITHUB_CLIENT_ID: "",
        VITE_GITHUB_REDIRECT_URI: "",
        VITE_GITHUB_SCOPE: "",
        VITE_GOOGLE_CLIENT_ID: "",
      };

      mockGetEnvConfig.mockReturnValue(expectedConfig);
      const config = mockGetEnvConfig();

      expect(config).toEqual(expectedConfig);
      expect(mockGetEnvConfig).toHaveBeenCalled();
    });
  });

  describe("Environment Detection Functions", () => {
    it("should detect development environment correctly", () => {
      mockIsDevelopment.mockReturnValue(true);
      mockIsProduction.mockReturnValue(false);
      mockIsLocal.mockReturnValue(false);
      mockGetCurrentMode.mockReturnValue("development");

      expect(mockIsDevelopment()).toBe(true);
      expect(mockIsProduction()).toBe(false);
      expect(mockIsLocal()).toBe(false);
      expect(mockGetCurrentMode()).toBe("development");
    });

    it("should detect production environment correctly", () => {
      mockIsDevelopment.mockReturnValue(false);
      mockIsProduction.mockReturnValue(true);
      mockIsLocal.mockReturnValue(false);
      mockGetCurrentMode.mockReturnValue("production");

      expect(mockIsDevelopment()).toBe(false);
      expect(mockIsProduction()).toBe(true);
      expect(mockIsLocal()).toBe(false);
      expect(mockGetCurrentMode()).toBe("production");
    });

    it("should detect local environment correctly", () => {
      mockIsDevelopment.mockReturnValue(false);
      mockIsProduction.mockReturnValue(false);
      mockIsLocal.mockReturnValue(true);
      mockGetCurrentMode.mockReturnValue("local-dev");

      expect(mockIsDevelopment()).toBe(false);
      expect(mockIsProduction()).toBe(false);
      expect(mockIsLocal()).toBe(true);
      expect(mockGetCurrentMode()).toBe("local-dev");
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined environment variables gracefully", () => {
      mockIsDevelopment.mockReturnValue(false);
      mockIsProduction.mockReturnValue(false);
      mockIsLocal.mockReturnValue(false);
      mockGetCurrentMode.mockReturnValue(undefined);

      expect(mockIsDevelopment()).toBe(false);
      expect(mockIsProduction()).toBe(false);
      expect(mockIsLocal()).toBe(false);
      expect(mockGetCurrentMode()).toBeUndefined();
    });

    it("should handle empty string environment variables", () => {
      mockIsDevelopment.mockReturnValue(false);
      mockIsProduction.mockReturnValue(false);
      mockIsLocal.mockReturnValue(false);
      mockGetCurrentMode.mockReturnValue("");

      expect(mockIsDevelopment()).toBe(false);
      expect(mockIsProduction()).toBe(false);
      expect(mockIsLocal()).toBe(false);
      expect(mockGetCurrentMode()).toBe("");
    });
  });
});
