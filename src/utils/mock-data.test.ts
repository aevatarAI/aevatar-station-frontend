import { describe, expect, it } from "vitest";
import {
  LoginMockData,
  RegisterMockData,
  SendRegisterCodeMockData,
} from "./mock-data";

describe("Mock Data", () => {
  describe("LoginMockData", () => {
    it("should have correct response structure", () => {
      expect(LoginMockData).toHaveProperty("code", "500");
      expect(LoginMockData).toHaveProperty("message", "Placeholder data");
      expect(LoginMockData).toHaveProperty("data");
    });

    it("should have correct login data structure", () => {
      expect(LoginMockData.data).toEqual({
        access_token:
          "BwVIJ0H-4d5y4lzAtCr4S9QFOgd96VaEyLlB8F0ZPX9yymbgxfi9s3PcRXsQ",
        token_type: "Bearer",
        expires_in: 3599,
      });
    });
  });

  describe("SendRegisterCodeMockData", () => {
    it("should have correct response structure", () => {
      expect(SendRegisterCodeMockData).toHaveProperty("code", "500");
      expect(SendRegisterCodeMockData).toHaveProperty(
        "message",
        "Placeholder data",
      );
      expect(SendRegisterCodeMockData).toHaveProperty("data");
    });

    it("should have null data", () => {
      expect(SendRegisterCodeMockData.data).toBeNull();
    });
  });

  describe("RegisterMockData", () => {
    it("should have correct response structure", () => {
      expect(RegisterMockData).toHaveProperty("code", "500");
      expect(RegisterMockData).toHaveProperty("message", "Placeholder data");
      expect(RegisterMockData).toHaveProperty("data");
    });

    it("should have correct register data structure", () => {
      const data = RegisterMockData.data;
      expect(data).toMatchObject({
        tenantId: null,
        userName: "",
        email: "@example.com",
        emailConfirmed: false,
        isActive: true,
        lockoutEnabled: true,
        accessFailedCount: 0,
      });
    });

    it("should have correct timestamp formats", () => {
      const data = RegisterMockData.data;
      const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

      expect(data.lastPasswordChangeTime).toMatch(timestampRegex);
      expect(data.lastModificationTime).toMatch(timestampRegex);
      expect(data.creationTime).toMatch(timestampRegex);
    });

    it("should have a valid UUID for id", () => {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      expect(RegisterMockData.data.id).toMatch(uuidRegex);
    });

    it("should have empty extraProperties object", () => {
      expect(RegisterMockData.data.extraProperties).toEqual({});
    });
  });
});
