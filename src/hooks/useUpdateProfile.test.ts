import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUpdateProfile } from "./useUpdateProfile";

// Mock the API request
vi.mock("@/api", () => ({
  request: {
    profile: {
      getProfile: vi.fn(),
    },
  },
}));

// Mock jotai
const mockSetProfile = vi.fn();
vi.mock("jotai", () => ({
  useAtom: vi.fn(() => [null, mockSetProfile]),
}));

// Mock the profile atom
vi.mock("@/state/atoms/profile", () => ({
  USER_PROFILE_ATOM: "mock-profile-atom",
}));

import { request } from "@/api";

describe("useUpdateProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a function", () => {
    const { result } = renderHook(() => useUpdateProfile());

    expect(typeof result.current).toBe("function");
  });

  it("should call getProfile and set profile data", async () => {
    const mockProfileData = {
      id: "user-123",
      name: "Test User",
      email: "test@example.com",
    };

    (request.profile.getProfile as any).mockResolvedValue({
      data: mockProfileData,
    });

    const { result } = renderHook(() => useUpdateProfile());

    await act(async () => {
      await result.current();
    });

    expect(request.profile.getProfile).toHaveBeenCalledTimes(1);
    expect(mockSetProfile).toHaveBeenCalledWith(mockProfileData);
  });

  it("should handle API errors gracefully", async () => {
    const mockError = new Error("API Error");
    (request.profile.getProfile as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUpdateProfile());

    await act(async () => {
      try {
        await result.current();
      } catch (error) {
        expect(error).toBe(mockError);
      }
    });

    expect(request.profile.getProfile).toHaveBeenCalledTimes(1);
    expect(mockSetProfile).not.toHaveBeenCalled();
  });

  it("should be memoized with useCallback", () => {
    const { result, rerender } = renderHook(() => useUpdateProfile());

    const firstCallback = result.current;

    rerender();

    const secondCallback = result.current;

    // The callback should be the same reference due to useCallback
    expect(firstCallback).toBe(secondCallback);
  });

  it("should work with different profile data structures", async () => {
    const mockProfileData = {
      id: "user-456",
      username: "testuser",
      avatar: "https://example.com/avatar.jpg",
      preferences: {
        theme: "dark",
        notifications: true,
      },
    };

    (request.profile.getProfile as any).mockResolvedValue({
      data: mockProfileData,
    });

    const { result } = renderHook(() => useUpdateProfile());

    await act(async () => {
      await result.current();
    });

    expect(request.profile.getProfile).toHaveBeenCalledTimes(1);
    expect(mockSetProfile).toHaveBeenCalledWith(mockProfileData);
  });
});
