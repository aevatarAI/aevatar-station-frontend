import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEditProject } from "./useEditProject";

// Mock the API request
const mockEditProject = vi.hoisted(() => vi.fn());
vi.mock("@/api", () => ({
  request: {
    projects: {
      editProject: mockEditProject,
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

describe("useEditProject", () => {
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
    const { result } = renderHook(() => useEditProject());

    expect(result.current).toHaveProperty("mutate");
    expect(result.current).toHaveProperty("mutateAsync");
    expect(result.current).toHaveProperty("isPending");
    expect(result.current).toHaveProperty("isError");
    expect(result.current).toHaveProperty("isSuccess");
    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("error");
  });

  it("should call useMutation with correct parameters", () => {
    renderHook(() => useEditProject());

    expect(mockUseMutation).toHaveBeenCalledWith({
      mutationKey: ["project", { organizationId: mockOrganizationId }],
      mutationFn: expect.any(Function),
      onError: expect.any(Function),
      onSettled: expect.any(Function),
    });
  });

  it("should call editProject API with correct parameters", async () => {
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

    renderHook(() => useEditProject());

    const testData = {
      id: "project-123",
      organizationId: "org-123",
      displayName: "Updated Project",
      domainName: "updated.com",
    };

    await mockMutationFn(testData);

    expect(mockEditProject).toHaveBeenCalledWith({
      query: "project-123",
      data: testData,
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

    renderHook(() => useEditProject());

    const testError = new Error("API Error");
    mockOnError(testError);

    expect(console.error).toHaveBeenCalledWith(testError);
    expect(mockToast).toHaveBeenCalledWith({
      description: "Unable to edit project",
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

    renderHook(() => useEditProject());

    mockOnSettled();

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["projects", { organizationId: mockOrganizationId }],
    });
  });

  it("should be defined", () => {
    const { result } = renderHook(() => useEditProject());
    expect(result.current).toBeDefined();
  });
});
