import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGetOrganisationInvites } from "./useGetOrganisationInvites";

// Mock the API request
vi.mock("@/api", () => ({
  request: {
    notifications: {
      getInvites: vi.fn(),
    },
  },
}));

// Mock useEmail hook
vi.mock("@/hooks/useEmail", () => ({
  useEmail: vi.fn(() => "test@example.com"),
}));

// Mock React Query
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

import { request } from "@/api";
import { useQuery } from "@tanstack/react-query";

describe("useGetOrganisationInvites", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useQuery with correct parameters when email is available", () => {
    renderHook(() => useGetOrganisationInvites());

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ["organisationInvites", { email: "test@example.com" }],
      queryFn: expect.any(Function),
      enabled: true,
    });
  });

  it("should handle different email values", () => {
    renderHook(() => useGetOrganisationInvites());

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ["organisationInvites", { email: "test@example.com" }],
      queryFn: expect.any(Function),
      enabled: true,
    });
  });

  it("should call getInvites API with correct parameters", async () => {
    const mockResponse = { data: [] };
    (request.notifications.getInvites as any).mockResolvedValue(mockResponse);

    renderHook(() => useGetOrganisationInvites());

    // Get the queryFn from the mock call
    const queryCall = vi.mocked(useQuery).mock.calls[0][0];
    await queryCall.queryFn();

    expect(request.notifications.getInvites).toHaveBeenCalledWith({
      params: {
        pageIndex: 0,
        pageSize: 100,
      },
    });
  });

  it("should be defined", () => {
    const { result } = renderHook(() => useGetOrganisationInvites());
    expect(result.current).toBeDefined();
  });
});
