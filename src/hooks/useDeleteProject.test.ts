import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDeleteProject } from "./useDeleteProject";

// Mock the API request
const mockDeleteProject = vi.hoisted(() => vi.fn());
vi.mock("@/api", () => ({
  request: {
    projects: {
      deleteProject: mockDeleteProject,
    },
  },
}));

// Mock useToast
const mockToast = vi.hoisted(() => vi.fn());
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock error handling utility
const mockHandleErrorMessage = vi.hoisted(() =>
  vi.fn((error, message) => `${message}: ${error.message}`),
);
vi.mock("@/utils/error", () => ({
  handleErrorMessage: mockHandleErrorMessage,
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
const mockMutate = vi.hoisted(() => vi.fn());
const mockMutateAsync = vi.hoisted(() => vi.fn());
const mockInvalidateQueries = vi.hoisted(() => vi.fn());
const mockUseMutation = vi.hoisted(() => vi.fn());
const mockUseQueryClient = vi.hoisted(() => vi.fn());

vi.mock("@tanstack/react-query", () => ({
  useMutation: mockUseMutation,
  useQueryClient: mockUseQueryClient,
}));

describe("useDeleteProject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.error
    vi.spyOn(console, "error").mockImplementation(() => {});

    mockUseMutation.mockReturnValue({
      mutate: mockMutate,
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      isSuccess: false,
      data: null,
      error: null,
    });
    mockUseQueryClient.mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    });
  });

  it("should return mutation object with correct properties", () => {
    const { result } = renderHook(() => useDeleteProject());

    expect(result.current).toHaveProperty("mutate");
    expect(result.current).toHaveProperty("mutateAsync");
    expect(result.current).toHaveProperty("isPending");
    expect(result.current).toHaveProperty("isError");
    expect(result.current).toHaveProperty("isSuccess");
    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("error");
  });

  it("should call useMutation with correct parameters", () => {
    renderHook(() => useDeleteProject());

    expect(mockUseMutation).toHaveBeenCalledWith({
      mutationKey: ["project", { organizationId: mockOrganizationId }],
      mutationFn: expect.any(Function),
      onError: expect.any(Function),
      onSettled: expect.any(Function),
    });
  });

  it("should call deleteProject API with correct query parameter", async () => {
    const mockMutationFn = vi.fn();
    mockUseMutation.mockImplementation((config) => {
      mockMutationFn.mockImplementation(config.mutationFn);
      return {
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isPending: false,
        isError: false,
        isSuccess: false,
        data: null,
        error: null,
      };
    });

    renderHook(() => useDeleteProject());

    const testId = "project-123";
    await mockMutationFn(testId);

    expect(mockDeleteProject).toHaveBeenCalledWith({
      query: testId,
    });
  });

  it("should handle error and show toast", async () => {
    const mockOnError = vi.fn();
    mockUseMutation.mockImplementation((config) => {
      mockOnError.mockImplementation(config.onError);
      return {
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isPending: false,
        isError: false,
        isSuccess: false,
        data: null,
        error: null,
      };
    });

    renderHook(() => useDeleteProject());

    const testError = new Error("API Error");
    mockOnError(testError);

    expect(console.error).toHaveBeenCalledWith(testError);
    expect(mockHandleErrorMessage).toHaveBeenCalledWith(
      testError,
      "unable to delete project",
    );
    expect(mockToast).toHaveBeenCalledWith({
      description: "unable to delete project: API Error",
    });
  });

  it("should invalidate queries on settled", async () => {
    const mockOnSettled = vi.fn();
    mockUseMutation.mockImplementation((config) => {
      mockOnSettled.mockImplementation(config.onSettled);
      return {
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isPending: false,
        isError: false,
        isSuccess: false,
        data: null,
        error: null,
      };
    });

    renderHook(() => useDeleteProject());

    mockOnSettled();

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["projects", { organizationId: mockOrganizationId }],
    });
  });

  it("should be defined", () => {
    const { result } = renderHook(() => useDeleteProject());
    expect(result.current).toBeDefined();
  });
});
