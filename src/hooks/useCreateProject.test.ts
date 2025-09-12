import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCreateProject, useCreateProjectHandler } from "./useCreateProject";

// Mock the API request
vi.mock("@/api", () => ({
  request: {
    projects: {
      addProject: vi.fn(),
    },
  },
}));

// Mock useToast
const mockToast = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
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
const mockMutate = vi.fn();
const mockMutateAsync = vi.fn();
const mockInvalidateQueries = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(() => ({
    mutate: mockMutate,
    mutateAsync: mockMutateAsync,
    isPending: false,
    isError: false,
    isSuccess: false,
    data: null,
    error: null,
  })),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: mockInvalidateQueries,
  })),
}));

describe("useCreateProject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return mutation object with correct properties", () => {
    const { result } = renderHook(() => useCreateProject());

    expect(result.current).toHaveProperty("mutate");
    expect(result.current).toHaveProperty("mutateAsync");
    expect(result.current).toHaveProperty("isPending");
    expect(result.current).toHaveProperty("isError");
    expect(result.current).toHaveProperty("isSuccess");
    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("error");
  });

  it("should be defined", () => {
    const { result } = renderHook(() => useCreateProject());
    expect(result.current).toBeDefined();
  });
});

describe("useCreateProjectHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a function", () => {
    const { result } = renderHook(() => useCreateProjectHandler());
    expect(typeof result.current).toBe("function");
  });

  it("should be defined", () => {
    const { result } = renderHook(() => useCreateProjectHandler());
    expect(result.current).toBeDefined();
  });
});
