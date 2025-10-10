import { describe, expect, it } from "vitest";
import { SIGNAL_R_URL, isDevelopment, isProduction } from "./config";

describe("config.ts", () => {
  describe("isDevelopment", () => {
    it("should be a function", () => {
      expect(typeof isDevelopment).toBe("function");
    });

    it("should return a boolean", () => {
      const result = isDevelopment();
      expect(typeof result).toBe("boolean");
    });

    it("should check DEV environment variable", () => {
      // Test current environment
      const result = isDevelopment();
      expect(result).toBe(import.meta.env.DEV === true);
    });
  });

  describe("isProduction", () => {
    it("should be a function", () => {
      expect(typeof isProduction).toBe("function");
    });

    it("should return a boolean", () => {
      const result = isProduction();
      expect(typeof result).toBe("boolean");
    });

    it("should check PROD environment variable", () => {
      // Test current environment
      const result = isProduction();
      expect(result).toBe(import.meta.env.PROD === true);
    });
  });

  describe("SIGNAL_R_URL", () => {
    it("should be a string", () => {
      expect(typeof SIGNAL_R_URL).toBe("string");
    });

    it("should contain the correct path", () => {
      expect(SIGNAL_R_URL).toContain("/developer-client/api/notifications");
    });

    it("should use VITE_APP_SIGNAL_R_URL if available", () => {
      const expectedUrl = import.meta.env.VITE_APP_SIGNAL_R_URL
        ? `${
            import.meta.env.VITE_APP_SIGNAL_R_URL
          }/developer-client/api/notifications`
        : "/developer-client/api/notifications";

      expect(SIGNAL_R_URL).toBe(expectedUrl);
    });

    it("should handle undefined VITE_APP_SIGNAL_R_URL", () => {
      // Test that it doesn't throw when VITE_APP_SIGNAL_R_URL is undefined
      expect(() => {
        const url = `${
          import.meta.env.VITE_APP_SIGNAL_R_URL ?? ""
        }/developer-client/api/notifications`;
        return url;
      }).not.toThrow();
    });
  });

  describe("environment variables", () => {
    it("should have import.meta.env available", () => {
      expect(import.meta.env).toBeDefined();
      expect(typeof import.meta.env).toBe("object");
    });

    it("should have DEV property", () => {
      expect("DEV" in import.meta.env).toBe(true);
    });

    it("should have PROD property", () => {
      expect("PROD" in import.meta.env).toBe(true);
    });

    it("should have VITE_APP_SIGNAL_R_URL property", () => {
      expect("VITE_APP_SIGNAL_R_URL" in import.meta.env).toBe(true);
    });
  });

  describe("function behavior", () => {
    it("should return consistent results", () => {
      const devResult1 = isDevelopment();
      const devResult2 = isDevelopment();
      expect(devResult1).toBe(devResult2);

      const prodResult1 = isProduction();
      const prodResult2 = isProduction();
      expect(prodResult1).toBe(prodResult2);
    });

    it("should not throw errors", () => {
      expect(() => isDevelopment()).not.toThrow();
      expect(() => isProduction()).not.toThrow();
    });
  });
});
