import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLogin } from "./useLogin";

// Mock dependencies
vi.mock("@/api/axios", () => ({
  service: {
    defaults: {
      headers: {},
    },
  },
}));

vi.mock("@/hooks/useUpdateProfile", () => ({
  useUpdateProfile: vi.fn(),
}));

vi.mock("@/services/auth", () => ({
  login: vi.fn(),
}));

vi.mock("jotai", () => ({
  useAtom: vi.fn(),
  atom: vi.fn(),
}));

import { service } from "@/api/axios";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { login } from "@/services/auth";
import { useAtom } from "jotai";

const mockUseUpdateProfile = vi.mocked(useUpdateProfile);
const mockLogin = vi.mocked(login);
const mockUseAtom = vi.mocked(useAtom);

describe("useLogin", () => {
  const mockSetAccessToken = vi.fn();
  const mockSetRefreshToken = vi.fn();
  const mockGetUserProfile = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAtom
      .mockReturnValueOnce([null, mockSetAccessToken]) // accessTokenAtom
      .mockReturnValueOnce([null, mockSetRefreshToken]); // refreshTokenAtom
    mockUseUpdateProfile.mockReturnValue(mockGetUserProfile);
    // Clear service headers
    service.defaults.headers = {};
  });

  it("should return loginUser function", () => {
    const { loginUser } = useLogin();

    expect(typeof loginUser).toBe("function");
  });

  it("should login successfully with valid credentials", async () => {
    const mockLoginData = {
      token_type: "Bearer",
      access_token: "test-access-token",
      refresh_token: "test-refresh-token",
    };
    mockLogin.mockResolvedValue(mockLoginData);

    const { loginUser } = useLogin();
    const result = await loginUser("test@example.com", "password123");

    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    expect(service.defaults.headers.Authorization).toBe(
      "Bearer test-access-token",
    );
    expect(mockSetAccessToken).toHaveBeenCalledWith("Bearer test-access-token");
    expect(mockSetRefreshToken).toHaveBeenCalledWith("test-refresh-token");
    expect(mockGetUserProfile).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it("should handle login failure", async () => {
    mockLogin.mockRejectedValue(new Error("Invalid credentials"));

    const { loginUser } = useLogin();
    const result = await loginUser("test@example.com", "wrongpassword");

    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "wrongpassword");
    expect(service.defaults.headers.Authorization).toBeUndefined();
    expect(mockSetAccessToken).not.toHaveBeenCalled();
    expect(mockSetRefreshToken).not.toHaveBeenCalled();
    expect(mockGetUserProfile).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it("should handle different token types", async () => {
    const mockLoginData = {
      token_type: "JWT",
      access_token: "test-jwt-token",
      refresh_token: "test-refresh-token",
    };
    mockLogin.mockResolvedValue(mockLoginData);

    const { loginUser } = useLogin();
    const result = await loginUser("test@example.com", "password123");

    expect(service.defaults.headers.Authorization).toBe("JWT test-jwt-token");
    expect(mockSetAccessToken).toHaveBeenCalledWith("JWT test-jwt-token");
    expect(result).toBe(true);
  });

  it("should handle empty token type", async () => {
    const mockLoginData = {
      token_type: "",
      access_token: "test-token",
      refresh_token: "test-refresh-token",
    };
    mockLogin.mockResolvedValue(mockLoginData);

    const { loginUser } = useLogin();
    const result = await loginUser("test@example.com", "password123");

    expect(service.defaults.headers.Authorization).toBe(" test-token");
    expect(mockSetAccessToken).toHaveBeenCalledWith(" test-token");
    expect(result).toBe(true);
  });

  it("should handle network error", async () => {
    mockLogin.mockRejectedValue(new Error("Network error"));

    const { loginUser } = useLogin();
    const result = await loginUser("test@example.com", "password123");

    expect(result).toBe(false);
  });

  it("should handle different username formats", async () => {
    const mockLoginData = {
      token_type: "Bearer",
      access_token: "test-token",
      refresh_token: "test-refresh-token",
    };
    mockLogin.mockResolvedValue(mockLoginData);

    const { loginUser } = useLogin();

    // Test with email
    await loginUser("user@example.com", "password123");
    expect(mockLogin).toHaveBeenCalledWith("user@example.com", "password123");

    // Test with username
    await loginUser("username", "password123");
    expect(mockLogin).toHaveBeenCalledWith("username", "password123");
  });

  it("should handle empty credentials", async () => {
    mockLogin.mockRejectedValue(new Error("Empty credentials"));

    const { loginUser } = useLogin();
    const result = await loginUser("", "");

    expect(result).toBe(false);
  });
});
