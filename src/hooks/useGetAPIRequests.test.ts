import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGetAPIRequests } from "./useGetAPIRequests";

// Mock the API request
vi.mock("@/api", () => ({
  request: {
    apiRequests: {
      getAPIRequest: vi.fn(),
    },
  },
}));

// Mock jotai
const mockProjectId = "project-123";
const mockOrganisationId = "org-123";
vi.mock("jotai", () => ({
  useAtom: vi.fn((atom) => {
    if (atom === "CURRENT_PROJECT_ATOM") {
      return [mockProjectId, vi.fn()];
    }
    if (atom === "CURRENT_ORGANIZATION_ATOM") {
      return [mockOrganisationId, vi.fn()];
    }
    return [null, vi.fn()];
  }),
}));

// Mock the atoms
vi.mock("@/state/atoms/organisation", () => ({
  CURRENT_ORGANIZATION_ATOM: "CURRENT_ORGANIZATION_ATOM",
  CURRENT_PROJECT_ATOM: "CURRENT_PROJECT_ATOM",
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

describe("useGetAPIRequests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useQuery with correct parameters when enabled", () => {
    const date = { from: 1234567890, to: 1234567890 };
    const hasPermission = true;

    renderHook(() => useGetAPIRequests(date, hasPermission));

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: [
        "api-requests",
        { projectId: "project-123", organisationId: "org-123", ...date },
      ],
      queryFn: expect.any(Function),
      enabled: true,
    });
  });

  it("should be disabled when date is invalid", () => {
    const date = { from: 0, to: 0 };
    const hasPermission = true;

    renderHook(() => useGetAPIRequests(date, hasPermission));

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: [
        "api-requests",
        { projectId: "project-123", organisationId: "org-123", ...date },
      ],
      queryFn: expect.any(Function),
      enabled: false,
    });
  });

  it("should be disabled when hasPermission is false", () => {
    const date = { from: 1234567890, to: 1234567890 };
    const hasPermission = false;

    renderHook(() => useGetAPIRequests(date, hasPermission));

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: [
        "api-requests",
        { projectId: "project-123", organisationId: "org-123", ...date },
      ],
      queryFn: expect.any(Function),
      enabled: false,
    });
  });

  it("should call getAPIRequest API with correct parameters", async () => {
    const date = { from: 1234567890, to: 1234567890 };
    const hasPermission = true;
    const mockResponse = { data: [] };
    (request.apiRequests.getAPIRequest as any).mockResolvedValue(mockResponse);

    renderHook(() => useGetAPIRequests(date, hasPermission));

    // Get the queryFn from the mock call
    const queryCall = vi.mocked(useQuery).mock.calls[0][0];
    await queryCall.queryFn();

    expect(request.apiRequests.getAPIRequest).toHaveBeenCalledWith({
      params: {
        OrganizationId: "org-123",
        ProjectId: "project-123",
        StartTime: 1234567890,
        EndTime: 1234567890,
      },
    });
  });

  it("should be defined", () => {
    const date = { from: 1234567890, to: 1234567890 };
    const hasPermission = true;
    const { result } = renderHook(() => useGetAPIRequests(date, hasPermission));
    expect(result.current).toBeDefined();
  });
});
