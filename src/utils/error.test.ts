import { describe, expect, it } from "vitest";
import {
  handleContractError,
  handleContractErrorMessage,
  handleError,
  handleErrorMessage,
} from "./error";

describe("Error Handling Utils", () => {
  describe("handleError", () => {
    it("should return error.error if available", () => {
      const error = { error: "inner error" };
      expect(handleError(error)).toBe("inner error");
    });

    it("should return error itself if error.error is not available", () => {
      const error = "direct error";
      expect(handleError(error)).toBe("direct error");
    });

    it("should handle undefined input", () => {
      expect(handleError(undefined)).toBeUndefined();
    });

    it("should handle null input", () => {
      expect(handleError(null)).toBeNull();
    });

    it("should handle empty object input", () => {
      expect(handleError({})).toEqual({});
    });
  });

  describe("handleContractError", () => {
    it("should handle string error", () => {
      expect(handleContractError("error message")).toEqual({
        message: "error message",
      });
    });

    it("should handle error with message property", () => {
      const error = { message: "error message" };
      expect(handleContractError(error)).toEqual(error);
    });

    it("should handle error with Error object containing Details", () => {
      const error = { Error: { Details: "error details", Code: 123 } };
      expect(handleContractError(error)).toEqual({
        message: "error details",
        code: 123,
      });
    });

    it("should handle error with Error object containing Message", () => {
      const error = { Error: { Message: "error message", Code: 123 } };
      expect(handleContractError(error)).toEqual({
        message: "error message",
        code: 123,
      });
    });

    it("should handle error with Error as string", () => {
      const error = { Error: "error string" };
      expect(handleContractError(error)).toEqual({
        message: "error string",
      });
    });

    it("should handle request error object", () => {
      const req = {
        error: { message: { Code: 123, Message: "error message" } },
        errorMessage: { message: "error description" },
      };
      expect(handleContractError(undefined, req)).toEqual({
        code: 123,
        message: "error description",
      });
    });

    it("should handle request with string error", () => {
      const req = {
        error: "string error",
        errorMessage: { message: "error description" },
      };
      expect(handleContractError(undefined, req)).toEqual({
        code: "string error",
        message: "error description",
      });
    });
  });

  describe("handleContractErrorMessage", () => {
    it("should handle string error", () => {
      expect(handleContractErrorMessage("error message")).toBe("error message");
    });

    it("should handle error with message property", () => {
      const error = { message: "error message" };
      expect(handleContractErrorMessage(error)).toBe("error message");
    });

    it("should handle error with Error object containing Details", () => {
      const error = { Error: { Details: "error details" } };
      expect(handleContractErrorMessage(error)).toBe("error details");
    });

    it("should handle error with Error object containing Message", () => {
      const error = { Error: { Message: "error message" } };
      expect(handleContractErrorMessage(error)).toBe("error message");
    });

    it("should handle error with Error as string", () => {
      const error = { Error: "error string" };
      expect(handleContractErrorMessage(error)).toBe("error string");
    });

    it("should handle error with Status", () => {
      const error = { Status: "failed" };
      expect(handleContractErrorMessage(error)).toBe("Transaction: failed");
    });

    it("should handle undefined error", () => {
      expect(handleContractErrorMessage(undefined)).toBe("Transaction: error");
    });

    it("should handle empty object", () => {
      expect(handleContractErrorMessage({})).toBe("Transaction: error");
    });
  });

  describe("handleErrorMessage", () => {
    it("should handle 500 status error", () => {
      const error = { status: 500 };
      expect(handleErrorMessage(error)).toBe("Failed to fetch data");
      expect(handleErrorMessage(error, "Custom error")).toBe("Custom error");
    });

    it("should handle error with message", () => {
      const error = { message: "error message" };
      expect(handleErrorMessage(error)).toBe("error message");
    });

    it("should return empty string for undefined error and errorText", () => {
      expect(handleErrorMessage(undefined)).toBe("");
    });

    it("should handle nested error object", () => {
      const error = { error: { message: "nested error message" } };
      expect(handleErrorMessage(error)).toBe("nested error message");
    });

    it("should use provided errorText as fallback", () => {
      const error = {};
      expect(handleErrorMessage(error, "fallback error")).toBe(
        "fallback error",
      );
    });

    it("should handle string error", () => {
      expect(handleErrorMessage("string error")).toBe("string error");
    });

    it("should handle null error", () => {
      expect(handleErrorMessage(null)).toBe("");
    });
  });
});
