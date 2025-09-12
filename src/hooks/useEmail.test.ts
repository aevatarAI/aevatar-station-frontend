import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEmail, useJWTDecode } from "./useEmail";

// Mock dependencies
vi.mock("@/hooks/useAccessToken", () => ({
  useAccessTokenAtom: vi.fn(),
}));

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

import { useAccessTokenAtom } from "@/hooks/useAccessToken";
import { jwtDecode } from "jwt-decode";

const mockUseAccessTokenAtom = vi.mocked(useAccessTokenAtom);
const mockJwtDecode = vi.mocked(jwtDecode);

describe("useEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return empty string when no access token", () => {
    mockUseAccessTokenAtom.mockReturnValue("");

    const result = useEmail();

    expect(result).toBe("");
  });

  it("should return empty string when access token is null", () => {
    mockUseAccessTokenAtom.mockReturnValue(null as any);

    const result = useEmail();

    expect(result).toBe("");
  });

  it("should return email from decoded token", () => {
    const mockToken = "test-token";
    const mockDecoded = { email: "test@example.com" };
    mockUseAccessTokenAtom.mockReturnValue(mockToken);
    mockJwtDecode.mockReturnValue(mockDecoded as any);

    const result = useEmail();

    expect(mockJwtDecode).toHaveBeenCalledWith(mockToken);
    expect(result).toBe("test@example.com");
  });

  it("should return empty string when decoded token has no email", () => {
    const mockToken = "test-token";
    const mockDecoded = { name: "test" };
    mockUseAccessTokenAtom.mockReturnValue(mockToken);
    mockJwtDecode.mockReturnValue(mockDecoded as any);

    const result = useEmail();

    expect(mockJwtDecode).toHaveBeenCalledWith(mockToken);
    expect(result).toBe("");
  });

  it("should return empty string when decoded token is null", () => {
    const mockToken = "test-token";
    mockUseAccessTokenAtom.mockReturnValue(mockToken);
    mockJwtDecode.mockReturnValue(null as any);

    const result = useEmail();

    expect(mockJwtDecode).toHaveBeenCalledWith(mockToken);
    expect(result).toBe("");
  });

  it("should handle jwt decode error", () => {
    const mockToken = "invalid-token";
    mockUseAccessTokenAtom.mockReturnValue(mockToken);
    mockJwtDecode.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    expect(() => useEmail()).toThrow("Invalid token");
  });
});

describe("useJWTDecode", () => {
  it("should return decodeJwt function", () => {
    const { decodeJwt } = useJWTDecode();

    expect(typeof decodeJwt).toBe("function");
  });

  it("should decode JWT token correctly", () => {
    const mockToken = "test-token";
    const mockDecoded = { email: "test@example.com", name: "test" };
    mockJwtDecode.mockReturnValue(mockDecoded as any);

    const { decodeJwt } = useJWTDecode();
    const result = decodeJwt(mockToken);

    expect(mockJwtDecode).toHaveBeenCalledWith(mockToken);
    expect(result).toBe(mockDecoded);
  });

  it("should handle decodeJwt with different token", () => {
    const mockToken1 = "token1";
    const mockToken2 = "token2";
    const mockDecoded1 = { email: "user1@example.com" };
    const mockDecoded2 = { email: "user2@example.com" };

    mockJwtDecode
      .mockReturnValueOnce(mockDecoded1 as any)
      .mockReturnValueOnce(mockDecoded2 as any);

    const { decodeJwt } = useJWTDecode();
    const result1 = decodeJwt(mockToken1);
    const result2 = decodeJwt(mockToken2);

    expect(mockJwtDecode).toHaveBeenCalledWith(mockToken1);
    expect(mockJwtDecode).toHaveBeenCalledWith(mockToken2);
    expect(result1).toBe(mockDecoded1);
    expect(result2).toBe(mockDecoded2);
  });
});
