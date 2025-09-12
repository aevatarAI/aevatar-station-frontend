import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGeneral } from "./useGeneral";

// Mock useGetOrganizations
const mockRefetch = vi.fn();
const mockData = {
  data: {
    items: [
      { id: "org-1", displayName: "Organization 1" },
      { id: "org-2", displayName: "Organization 2" },
      { id: "org-123", displayName: "Current Organization" },
    ],
  },
};

vi.mock("@/hooks/useGetOrganizations", () => ({
  useGetOrganizations: () => ({
    data: mockData,
    refetch: mockRefetch,
  }),
}));

// Mock useUpdateOrganisationName
const mockMutateAsync = vi.fn();
vi.mock("@/hooks/useUpdateOrganisationName", () => ({
  useUpdateOrganisationName: () => ({
    mutateAsync: mockMutateAsync,
  }),
}));

// Mock jotai
const mockOrgId = "org-123";
vi.mock("jotai", () => ({
  useAtom: vi.fn(() => [mockOrgId, vi.fn()]),
}));

// Mock the organization atom
vi.mock("@/state/atoms/organisation", () => ({
  CURRENT_ORGANIZATION_ATOM: "mock-org-atom",
}));

describe("useGeneral", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return handleUpdateName function and currentOrg", () => {
    const { result } = renderHook(() => useGeneral());

    expect(typeof result.current.handleUpdateName).toBe("function");
    expect(result.current.currentOrg).toEqual({
      id: "org-123",
      displayName: "Current Organization",
    });
  });

  it("should find correct current organization by ID", () => {
    const { result } = renderHook(() => useGeneral());

    expect(result.current.currentOrg).toEqual({
      id: "org-123",
      displayName: "Current Organization",
    });
  });

  it("should handle different organization scenarios", () => {
    const { result } = renderHook(() => useGeneral());

    // Test that the hook returns the expected structure
    expect(result.current).toHaveProperty("handleUpdateName");
    expect(result.current).toHaveProperty("currentOrg");
    expect(typeof result.current.handleUpdateName).toBe("function");
  });

  it("should be defined", () => {
    const { result } = renderHook(() => useGeneral());
    expect(result.current).toBeDefined();
    expect(result.current.handleUpdateName).toBeDefined();
  });
});
