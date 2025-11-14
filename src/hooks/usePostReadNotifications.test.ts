import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePostReadNotifications } from "./usePostReadNotifications";

// Mock the API request
vi.mock("@/api", () => ({
  request: {
    notifications: {
      postReadNotifications: vi.fn(),
    },
  },
}));

// Mock useEmail hook
vi.mock("@/hooks/useEmail", () => ({
  useEmail: vi.fn(() => "test@example.com"),
}));

// Mock jotai
const mockSetUnreadNotifications = vi.fn();
vi.mock("jotai", () => ({
  useAtom: vi.fn(() => [null, mockSetUnreadNotifications]),
}));

// Mock the notification atom
vi.mock("@/state/atoms/notification", () => ({
  UNREAD_NOTIFICATION_ATOM: "mock-notification-atom",
}));

// Mock React Query
vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isPending: false,
    isError: false,
    isSuccess: false,
    data: null,
    error: null,
  })),
}));

import { request } from "@/api";
import { useMutation } from "@tanstack/react-query";

describe("usePostReadNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return mutation object with correct properties", () => {
    const { result } = renderHook(() => usePostReadNotifications());

    expect(result.current).toHaveProperty("mutate");
    expect(result.current).toHaveProperty("mutateAsync");
    expect(result.current).toHaveProperty("isPending");
    expect(result.current).toHaveProperty("isError");
    expect(result.current).toHaveProperty("isSuccess");
    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("error");
  });

  it("should call useMutation with correct parameters", () => {
    renderHook(() => usePostReadNotifications());

    expect(useMutation).toHaveBeenCalledWith({
      mutationKey: ["read-notifications", { email: "test@example.com" }],
      mutationFn: expect.any(Function),
    });
  });

  it("should call postReadNotifications API and set unread notifications to false", async () => {
    const mockResponse = { success: true };
    (request.notifications.postReadNotifications as any).mockResolvedValue(
      mockResponse,
    );

    renderHook(() => usePostReadNotifications());

    // Get the mutationFn from the mock call
    const mutationCall = vi.mocked(useMutation).mock.calls[0][0];
    await mutationCall.mutationFn();

    expect(mockSetUnreadNotifications).toHaveBeenCalledWith(false);
    expect(request.notifications.postReadNotifications).toHaveBeenCalledWith({
      data: {},
    });
  });

  it("should be defined", () => {
    const { result } = renderHook(() => usePostReadNotifications());
    expect(result.current).toBeDefined();
  });
});
