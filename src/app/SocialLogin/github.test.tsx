import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GithubLoginCallback, useGetCallbackCode } from "./github";

// Mock the API
const mockService = vi.hoisted(() => ({
  defaults: {
    headers: {},
  },
}));

vi.mock("@/api/axios", () => ({
  service: mockService,
}));

// Mock the hooks
const mockNavigate = vi.fn();
const mockGetUserProfile = vi.fn();

vi.mock("@/hooks/navigate", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/hooks/useUpdateProfile", () => ({
  useUpdateProfile: () => mockGetUserProfile,
}));

// Mock jotai atoms
const mockSetLoginType = vi.fn();
const mockSetAccessToken = vi.fn();
const mockSetRefreshToken = vi.fn();

vi.mock("jotai", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAtom: vi.fn((atom) => {
      if (atom === "USER_LOGIN_TYPE") {
        return [null, mockSetLoginType];
      }
      if (atom === "accessTokenAtom") {
        return [null, mockSetAccessToken];
      }
      if (atom === "refreshTokenAtom") {
        return [null, mockSetRefreshToken];
      }
      return [null, vi.fn()];
    }),
  };
});

// Mock the atoms
vi.mock("@/state/atoms", () => ({
  accessTokenAtom: "accessTokenAtom",
  refreshTokenAtom: "refreshTokenAtom",
}));

vi.mock("@/state/atoms/profile", () => ({
  USER_LOGIN_TYPE: "USER_LOGIN_TYPE",
  IUserLoginType: {
    SOCIAL_MEDIA: "social_media",
  },
}));

// Mock React Query
const mockMutateAsync = vi.hoisted(() => vi.fn());
vi.mock("@tanstack/react-query", () => ({
  useMutation: () => ({
    mutateAsync: mockMutateAsync,
  }),
}));

// Mock axios
const mockAxios = vi.hoisted(() => ({
  post: vi.fn(),
}));
vi.mock("axios", () => ({
  default: mockAxios,
}));

// Mock the services
vi.mock("@/services/auth", () => ({
  CLIENT_ID: "test-client-id",
  GITHUB: "github",
  SCOPE: "test-scope",
}));

// Mock the state atoms
vi.mock("@/state/atoms/profile", () => ({
  IUserLoginType: {
    SOCIAL_MEDIA: "social_media",
  },
  USER_LOGIN_TYPE: "USER_LOGIN_TYPE",
}));

// Mock window.location
const mockLocation = {
  search: "",
};

Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
});

describe("GithubLoginCallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.search = "";
  });

  it("should render nothing", () => {
    const { container } = render(<GithubLoginCallback />);
    expect(container.firstChild).toBeNull();
  });

  it("should navigate to login when no code", async () => {
    mockLocation.search = "";

    render(<GithubLoginCallback />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("should handle successful login with code", async () => {
    mockLocation.search = "?code=test-code";

    const mockResponse = {
      access_token: "test-access-token",
      refresh_token: "test-refresh-token",
      token_type: "Bearer",
    };

    mockMutateAsync.mockResolvedValue(mockResponse);
    mockGetUserProfile.mockResolvedValue(undefined);

    render(<GithubLoginCallback />);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith("test-code");
    });

    await waitFor(
      () => {
        expect(mockService.defaults.headers.Authorization).toBe(
          "Bearer test-access-token",
        );
      },
      { timeout: 2000 },
    );

    await waitFor(
      () => {
        expect(mockSetAccessToken).toHaveBeenCalledWith(
          "Bearer test-access-token",
        );
        expect(mockSetRefreshToken).toHaveBeenCalledWith("test-refresh-token");
        expect(mockSetLoginType).toHaveBeenCalledWith("social_media");
        expect(mockGetUserProfile).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/redirect");
      },
      { timeout: 2000 },
    );
  });

  it("should handle login error", async () => {
    mockLocation.search = "?code=test-code";

    mockMutateAsync.mockRejectedValue(new Error("Login failed"));

    render(<GithubLoginCallback />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/error");
    });
  });

  it("should handle missing access token", async () => {
    mockLocation.search = "?code=test-code";

    const mockResponse = {
      refresh_token: "test-refresh-token",
      token_type: "Bearer",
    };

    mockMutateAsync.mockResolvedValue(mockResponse);

    render(<GithubLoginCallback />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/error");
    });
  });

  it("should not attempt login twice with same code", async () => {
    mockLocation.search = "?code=test-code";

    const mockResponse = {
      access_token: "test-access-token",
      refresh_token: "test-refresh-token",
      token_type: "Bearer",
    };

    mockMutateAsync.mockResolvedValue(mockResponse);
    mockGetUserProfile.mockResolvedValue(undefined);

    const { rerender } = render(<GithubLoginCallback />);

    // Re-render with same code
    rerender(<GithubLoginCallback />);

    await waitFor(() => {
      // Should only be called once
      expect(mockMutateAsync).toHaveBeenCalledTimes(1);
    });
  });

  it("should handle different codes on re-render", async () => {
    mockLocation.search = "?code=test-code-1";

    const mockResponse = {
      access_token: "test-access-token",
      refresh_token: "test-refresh-token",
      token_type: "Bearer",
    };

    mockMutateAsync.mockResolvedValue(mockResponse);
    mockGetUserProfile.mockResolvedValue(undefined);

    const { rerender } = render(<GithubLoginCallback />);

    // Change code
    mockLocation.search = "?code=test-code-2";
    rerender(<GithubLoginCallback />);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith("test-code-1");
    });
  });
});

describe("useGetCallbackCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should extract code from URL search params", () => {
    mockLocation.search = "?code=test-code&state=test-state";

    const { code } = useGetCallbackCode();

    expect(code).toBe("test-code");
  });

  it("should return null when no code in URL", () => {
    mockLocation.search = "?state=test-state";

    const { code } = useGetCallbackCode();

    expect(code).toBeNull();
  });

  it("should return null when no search params", () => {
    mockLocation.search = "";

    const { code } = useGetCallbackCode();

    expect(code).toBeNull();
  });

  it("should handle multiple parameters", () => {
    mockLocation.search =
      "?state=test-state&code=test-code&redirect=test-redirect";

    const { code } = useGetCallbackCode();

    expect(code).toBe("test-code");
  });
});
