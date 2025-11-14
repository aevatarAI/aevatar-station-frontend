import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLongPollUnreadNotifications } from "./useLongPollUnreadNotifications";

// Mock useGetUnreadNotifications hook
const mockData = { data: 0 };
const mockIsLoading = false;
vi.mock("@/hooks/useGetUnreadNotifications", () => ({
  useGetUnreadNotifications: vi.fn(() => ({
    data: mockData,
    isLoading: mockIsLoading,
  })),
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

// Mock React
vi.mock("react", () => ({
  useEffect: vi.fn((fn) => fn()),
}));

describe("useLongPollUnreadNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not throw error when called", () => {
    expect(() => {
      renderHook(() => useLongPollUnreadNotifications());
    }).not.toThrow();
  });
});
