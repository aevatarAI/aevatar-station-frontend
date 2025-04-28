import { useGetNotifications, useSignalR } from "@/hooks/useGetNotifications";
import { loadingAtom } from "@/state/atoms";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { useAtom } from "jotai";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProfileInner from "./index";

// Mock the hooks
vi.mock("@/hooks/useGetNotifications", () => ({
  useGetNotifications: vi.fn(),
  useSignalR: vi.fn(),
}));

vi.mock("jotai", async () => {
  const actual = await vi.importActual("jotai");
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});

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
  const mockEmptyData = {
    data: [],
    totalCount: 0,
  };

  const mockNotificationsData = {
    data: [
      {
        id: "1",
        creatorName: "Test User",
        content: "Test Content",
        creationTime: "2024-03-20T10:00:00Z",
        type: "INVITED",
        status: "DEFAULT",
      },
    ],
    totalCount: 1,
  };

  beforeEach(() => {
    (useGetNotifications as any).mockReturnValue({
      data: mockEmptyData,
      isLoading: false,
      isError: false,
    });
    (useSignalR as any).mockReturnValue({});
    (useAtom as any).mockImplementation((atom) => {
      if (atom === loadingAtom) {
        return [true];
      }
      return [null];
    });
  });

  it("renders general tab by default", () => {
    renderWithQueryClient(<ProfileInner tab="general" />);
    expect(screen.getByText("profile")).toBeInTheDocument();
  });

  it("renders notifications container when there is data", () => {
    (useGetNotifications as any).mockReturnValue({
      data: mockNotificationsData,
      isLoading: false,
      isError: false,
    });

    renderWithQueryClient(<ProfileInner tab="notifications" />);
    expect(screen.getByTestId("notifications-container")).toBeInTheDocument();
  });

  it("handles loading state", () => {
    (useGetNotifications as any).mockReturnValue({
      data: mockEmptyData,
      isLoading: true,
      isError: false,
    });

    renderWithQueryClient(<ProfileInner tab="notifications" />);
    expect(screen.getByText("Scanning......")).toBeInTheDocument();
  });

  it("handles error state", () => {
    (useGetNotifications as any).mockReturnValue({
      data: mockEmptyData,
      isLoading: false,
      isError: true,
    });

    renderWithQueryClient(<ProfileInner tab="notifications" />);
    expect(screen.getByTestId("error-message")).toBeInTheDocument();
  });

  it("shows empty notifications message when no data", () => {
    (useGetNotifications as any).mockReturnValue({
      data: { data: [], totalCount: 0 },
      isLoading: false,
      isError: false,
    });

    renderWithQueryClient(<ProfileInner tab="notifications" />);
    expect(screen.getByTestId("empty-notifications")).toBeInTheDocument();
  });

  it("resets query when switching tabs", () => {
    renderWithQueryClient(<ProfileInner tab="general" />);
    expect(useGetNotifications).toHaveBeenCalledWith({
      pageIndex: 0,
      pageSize: 10,
    });
  });
});
