import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getProjects, useGetProjects } from "./useGetProjects";

// Mock the API request
vi.mock("@/api", () => ({
  request: {
    projects: {
      getUserProject: vi.fn(),
    },
  },
}));

// Mock jotai
const mockOrganizationId = "org-123";
vi.mock("jotai", () => ({
  useAtom: vi.fn(() => [mockOrganizationId, vi.fn()]),
}));

// Mock the organization atom
vi.mock("@/state/atoms/organisation", () => ({
  CURRENT_ORGANIZATION_ATOM: "mock-org-atom",
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

describe("useGetProjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call useQuery with correct parameters", () => {
    renderHook(() => useGetProjects());

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ["projects", { organizationId: "org-123" }],
      queryFn: expect.any(Function),
      enabled: true,
    });
  });

  it("should be defined", () => {
    const { result } = renderHook(() => useGetProjects());
    expect(result.current).toBeDefined();
  });
});

describe("getProjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call getUserProject with correct organizationId", async () => {
    const organizationId = "test-org-123";
    const mockResponse = { data: [] };
    (request.projects.getUserProject as any).mockResolvedValue(mockResponse);

    await getProjects(organizationId);

    expect(request.projects.getUserProject).toHaveBeenCalledWith({
      params: { organizationId },
    });
  });

  it("should return the API response", async () => {
    const organizationId = "test-org-123";
    const mockResponse = { data: [{ id: "project-1", name: "Test Project" }] };
    (request.projects.getUserProject as any).mockResolvedValue(mockResponse);

    const result = await getProjects(organizationId);

    expect(result).toBe(mockResponse);
  });
});
