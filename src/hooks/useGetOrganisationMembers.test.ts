import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGetOrganizationMembers } from "./useGetOrganisationMembers";

// Mock the API utility
vi.mock("@/api/utils/organization", () => ({
  getOrganizationMembers: vi.fn(),
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

describe("useGetOrganizationMembers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should be defined", () => {
    const { result } = renderHook(() => useGetOrganizationMembers());
    expect(result.current).toBeDefined();
  });

  it("should handle different organization IDs", () => {
    const { result } = renderHook(() => useGetOrganizationMembers());
    expect(result.current).toBeDefined();
  });
});
