import { useGetNotifications } from "@/hooks/useGetNotifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProfileInner from "./index";

// Mock the hooks
vi.mock("@/hooks/useGetNotifications", () => ({
  useGetNotifications: vi.fn(),
  useSignalR: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithQueryClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

describe("ProfileInner", () => {
  const mockData = {
    items: [],
    totalCount: 0,
  };

  beforeEach(() => {
    (useGetNotifications as any).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    });
  });

  it("renders general tab by default", () => {
    renderWithQueryClient(<ProfileInner tab="general" />);
    expect(screen.getByTestId("general-tab")).toHaveClass("text-white");
    expect(screen.getByTestId("general-content")).toBeInTheDocument();
  });

  it("renders notifications tab when selected", () => {
    renderWithQueryClient(<ProfileInner tab="notifications" />);
    expect(screen.getByTestId("notifications-tab")).toHaveClass("text-white");
    expect(screen.getByTestId("notifications-content")).toBeInTheDocument();
  });

  it("handles loading state", () => {
    (useGetNotifications as any).mockReturnValue({
      data: mockData,
      isLoading: true,
      isError: false,
    });

    renderWithQueryClient(<ProfileInner tab="notifications" />);
    expect(screen.getByTestId("notifications-content")).toBeInTheDocument();
  });

  it("handles error state", () => {
    (useGetNotifications as any).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: true,
    });

    renderWithQueryClient(<ProfileInner tab="notifications" />);
    expect(screen.getByTestId("notifications-content")).toBeInTheDocument();
  });

  it("resets query when switching tabs", () => {
    renderWithQueryClient(<ProfileInner tab="general" />);

    const notificationsTab = screen.getByTestId("notifications-tab");
    fireEvent.click(notificationsTab);

    expect(useGetNotifications).toHaveBeenCalledWith({
      pageIndex: 0,
      pageSize: 10,
    });
  });
});
