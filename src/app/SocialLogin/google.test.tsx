import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GoogleLoginCallback, getURLParams } from "./google";

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
  const actual = (await importOriginal()) as any;
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
      if (atom === "USER_PROFILE_ATOM") {
        return [null, vi.fn()];
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
  USER_PROFILE_ATOM: "USER_PROFILE_ATOM",
  IUserLoginType: {
    SOCIAL_MEDIA: "social_media",
  },
}));

// Mock React Query
const mockMutateAsync = vi.hoisted(() => vi.fn());
const mockUseQuery = vi.hoisted(() => vi.fn());
vi.mock("@tanstack/react-query", () => ({
  useMutation: () => ({
    mutateAsync: mockMutateAsync,
  }),
  useQuery: mockUseQuery,
}));

// Mock axios
const mockAxios = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));
vi.mock("axios", () => ({
  default: mockAxios,
}));

// Mock the state atoms
vi.mock("@/state/atoms/profile", () => ({
  IUserLoginType: {
    SOCIAL_MEDIA: "social_media",
  },
  USER_LOGIN_TYPE: "USER_LOGIN_TYPE",
  USER_PROFILE_ATOM: "USER_PROFILE_ATOM",
}));

// Mock window.location
const mockLocation = {
  hash: "",
};

Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
});

// Mock console.log
const _mockConsoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

describe("GoogleLoginCallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.hash = "";
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
  });

  it("should render nothing", () => {
    const { container } = render(<GoogleLoginCallback />);
    expect(container.firstChild).toBeNull();
  });

  it("should handle successful login with hash", async () => {
    mockLocation.hash = "#access_token=google-token&id_token=google-id-token";

    const mockAuthResponse = {
      access_token: "test-access-token",
      refresh_token: "test-refresh-token",
      token_type: "Bearer",
    };

    const mockUserProfile = {
      id: "google-user-id",
      email: "test@google.com",
      name: "Test User",
    };

    mockMutateAsync.mockResolvedValue(mockAuthResponse);
    mockUseQuery.mockReturnValue({
      data: mockUserProfile,
      isLoading: false,
      error: null,
    });

    render(<GoogleLoginCallback />);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith("google-id-token", {
        onSettled: expect.any(Function),
        onError: expect.any(Function),
      });
    });
  });

  it("should handle missing access token in response", async () => {
    mockLocation.hash = "#access_token=google-token&id_token=google-id-token";

    const mockAuthResponse = {
      refresh_token: "test-refresh-token",
      token_type: "Bearer",
    };

    mockMutateAsync.mockResolvedValue(mockAuthResponse);

    render(<GoogleLoginCallback />);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith("google-id-token", {
        onSettled: expect.any(Function),
        onError: expect.any(Function),
      });
    });
  });

  it("should handle empty hash", async () => {
    mockLocation.hash = "";

    render(<GoogleLoginCallback />);

    // Should not call mutateAsync
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("should handle hash with only access_token", async () => {
    mockLocation.hash = "#access_token=google-token";

    render(<GoogleLoginCallback />);

    // Wait for the component to process the hash
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(undefined, {
        onSettled: expect.any(Function),
        onError: expect.any(Function),
      });
    });
  });

  it("should handle hash with only id_token", async () => {
    mockLocation.hash = "#id_token=google-id-token";

    const mockAuthResponse = {
      access_token: "test-access-token",
      refresh_token: "test-refresh-token",
      token_type: "Bearer",
    };

    mockMutateAsync.mockResolvedValue(mockAuthResponse);

    render(<GoogleLoginCallback />);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith("google-id-token", {
        onSettled: expect.any(Function),
        onError: expect.any(Function),
      });
    });
  });

  it("should set authorization header and tokens on successful login", async () => {
    mockLocation.hash = "#access_token=google-token&id_token=google-id-token";

    const mockAuthResponse = {
      access_token: "test-access-token",
      refresh_token: "test-refresh-token",
      token_type: "Bearer",
    };

    // Mock the mutation to resolve and call onSettled
    mockMutateAsync.mockImplementation((_idToken, options) => {
      // Simulate the success by calling onSettled
      if (options?.onSettled) {
        options.onSettled(mockAuthResponse);
      }
      return Promise.resolve(mockAuthResponse);
    });

    render(<GoogleLoginCallback />);

    // Wait for the mutation to be called
    await waitFor(
      () => {
        expect(mockMutateAsync).toHaveBeenCalledWith("google-id-token", {
          onSettled: expect.any(Function),
          onError: expect.any(Function),
        });
      },
      { timeout: 2000 },
    );

    // Wait for the onSettled callback to execute
    await waitFor(
      () => {
        // @ts-expect-error - Authorization is not defined on the mock service
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

  it("should handle user profile loading state", () => {
    mockLocation.hash = "#access_token=google-token&id_token=google-id-token";

    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<GoogleLoginCallback />);

    // Should still process the login even if profile is loading
    expect(mockMutateAsync).toHaveBeenCalled();
  });

  it("should handle user profile error", () => {
    mockLocation.hash = "#access_token=google-token&id_token=google-id-token";

    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Profile fetch failed"),
    });

    render(<GoogleLoginCallback />);

    // Should still process the login even if profile has error
    expect(mockMutateAsync).toHaveBeenCalled();
  });
});

describe("getURLParams", () => {
  it("should parse hash parameters correctly", () => {
    const hash = "#access_token=test-token&id_token=test-id&state=test-state";
    const params = getURLParams(hash);

    expect(params).toEqual({
      access_token: "test-token",
      id_token: "test-id",
      state: "test-state",
    });
  });

  it("should handle empty hash", () => {
    const hash = "#";
    const params = getURLParams(hash);

    expect(params).toEqual({});
  });

  it("should handle hash without parameters", () => {
    const hash = "";
    const params = getURLParams(hash);

    expect(params).toEqual({});
  });

  it("should handle single parameter", () => {
    const hash = "#access_token=test-token";
    const params = getURLParams(hash);

    expect(params).toEqual({
      access_token: "test-token",
    });
  });

  it("should handle parameters with special characters", () => {
    const hash =
      "#access_token=test-token%20with%20spaces&id_token=test-id%2Bplus";
    const params = getURLParams(hash);

    expect(params).toEqual({
      access_token: "test-token%20with%20spaces",
      id_token: "test-id%2Bplus",
    });
  });

  it("should handle malformed parameters", () => {
    const hash = "#access_token=test-token&malformed&id_token=test-id";
    const params = getURLParams(hash);

    expect(params).toEqual({
      access_token: "test-token",
      id_token: "test-id",
    });
  });

  it("should handle parameters with empty values", () => {
    const hash = "#access_token=&id_token=test-id&empty=";
    const params = getURLParams(hash);

    expect(params).toEqual({
      access_token: "",
      id_token: "test-id",
      empty: "",
    });
  });
});
