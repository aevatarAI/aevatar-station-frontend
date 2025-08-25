import { request } from "@/api";
import { useEmail } from "@/hooks/useEmail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { useGetUnreadNotifications } from "./useGetUnreadNotifications";

// Mock the useEmail hook
vi.mock("@/hooks/useEmail", () => ({
  useEmail: vi.fn(),
}));

// Mock the request.notifications.getUnreadNotifications
vi.mock("@/api", () => ({
  request: {
    notifications: {
      getUnreadNotifications: vi.fn(),
    },
  },
}));

describe("useGetUnreadNotifications", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("should not fetch when email is not available", () => {
    (useEmail as any).mockReturnValue(null);

    const { result } = renderHook(() => useGetUnreadNotifications(), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(request.notifications.getUnreadNotifications).not.toHaveBeenCalled();
  });

  it("should fetch notifications when email is available", async () => {
    const mockEmail = "test@example.com";
    const mockNotifications = [{ id: 1, message: "Test notification" }];

    (useEmail as any).mockReturnValue(mockEmail);
    (request.notifications.getUnreadNotifications as any).mockResolvedValue(
      mockNotifications,
    );

    const { result } = renderHook(() => useGetUnreadNotifications(), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockNotifications);
    expect(request.notifications.getUnreadNotifications).toHaveBeenCalled();
  });

  it("should handle error when fetching notifications fails", async () => {
    const mockEmail = "test@example.com";
    const mockError = new Error("Failed to fetch");

    (useEmail as any).mockReturnValue(mockEmail);
    (request.notifications.getUnreadNotifications as any).mockRejectedValue(
      mockError,
    );

    const { result } = renderHook(() => useGetUnreadNotifications(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it("should refetch notifications every 5 seconds", async () => {
    const mockEmail = "test@example.com";
    const mockNotifications = [{ id: 1, message: "Test notification" }];

    (useEmail as any).mockReturnValue(mockEmail);
    (request.notifications.getUnreadNotifications as any).mockResolvedValue(
      mockNotifications,
    );

    vi.useFakeTimers();

    renderHook(() => useGetUnreadNotifications(), {
      wrapper,
    });

    // Initial call
    expect(request.notifications.getUnreadNotifications).toHaveBeenCalledTimes(
      1,
    );

    // Fast-forward time by 5 seconds
    await vi.advanceTimersByTimeAsync(5000);
    expect(request.notifications.getUnreadNotifications).toHaveBeenCalledTimes(
      2,
    );

    // Fast-forward time by another 5 seconds
    await vi.advanceTimersByTimeAsync(5000);
    expect(request.notifications.getUnreadNotifications).toHaveBeenCalledTimes(
      3,
    );

    vi.useRealTimers();
  }, 10000); // Increase test timeout to 10 seconds
});
