import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUpdateOrganisationName } from "./useUpdateOrganisationName";

// Mock the API request
vi.mock("@/api", () => ({
  request: {
    organizations: {
      editOrganization: vi.fn(),
    },
  },
}));

// Mock useToast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
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

// Mock error utility
vi.mock("@/utils/error", () => ({
  handleErrorMessage: vi.fn((error, message) => `${message}: ${error}`),
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

describe("useUpdateOrganisationName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return mutation object with correct properties", () => {
    const { result } = renderHook(() => useUpdateOrganisationName());

    expect(result.current).toHaveProperty("mutate");
    expect(result.current).toHaveProperty("mutateAsync");
    expect(result.current).toHaveProperty("isPending");
    expect(result.current).toHaveProperty("isError");
    expect(result.current).toHaveProperty("isSuccess");
    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("error");
  });

  it("should call useMutation with correct parameters", () => {
    renderHook(() => useUpdateOrganisationName());

    expect(useMutation).toHaveBeenCalledWith({
      mutationKey: ["organisation", { orgId: "org-123" }],
      mutationFn: expect.any(Function),
    });
  });

  it("should be defined", () => {
    const { result } = renderHook(() => useUpdateOrganisationName());
    expect(result.current).toBeDefined();
  });
});
