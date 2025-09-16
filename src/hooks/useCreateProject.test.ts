import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCreateProject, useCreateProjectHandler } from "./useCreateProject";

// Mock the API request
const mockAddProject = vi.hoisted(() => vi.fn());
vi.mock("@/api", () => ({
  request: {
    projects: {
      addProject: mockAddProject,
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
const mockRefetchQueries = vi.hoisted(() => vi.fn());
const mockUseMutation = vi.hoisted(() => vi.fn());
const mockUseQueryClient = vi.hoisted(() => vi.fn());

vi.mock("@tanstack/react-query", () => ({
  useMutation: mockUseMutation,
  useQueryClient: mockUseQueryClient,
}));

describe("useCreateProject", () => {
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
      refetchQueries: mockRefetchQueries,
    });
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

  it("should call useMutation with correct parameters", () => {
    renderHook(() => useCreateProject());

    expect(mockUseMutation).toHaveBeenCalledWith({
      mutationKey: ["project", { organizationId: mockOrganizationId }],
      mutationFn: expect.any(Function),
      onError: expect.any(Function),
      onSettled: expect.any(Function),
    });
  });

  it("should call addProject API with correct data", async () => {
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

    renderHook(() => useCreateProject());

    const testData = {
      organizationId: "org-123",
      displayName: "Test Project",
      domainName: "test.com",
    };

    await mockMutationFn(testData);

    expect(mockAddProject).toHaveBeenCalledWith({
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

    renderHook(() => useCreateProject());

    const testError = new Error("API Error");
    mockOnError(testError);

    expect(console.error).toHaveBeenCalledWith(testError);
    expect(mockToast).toHaveBeenCalledWith({
      description: "Unable to create project",
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

    renderHook(() => useCreateProject());

    mockOnSettled();

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["projects", { organizationId: mockOrganizationId }],
    });
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

  it("should call addProject API and invalidate queries", async () => {
    const mockResult = { id: "project-123", name: "Test Project" };
    mockAddProject.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useCreateProjectHandler());

    const testData = {
      organizationId: "org-123",
      displayName: "Test Project",
      domainName: "test.com",
    };

    const response = await result.current(testData);

    expect(mockAddProject).toHaveBeenCalledWith({
      data: testData,
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["projects", { organizationId: mockOrganizationId }],
    });
    expect(response).toBe(mockResult);
  });

  it("should handle API errors", async () => {
    const testError = new Error("API Error");
    mockAddProject.mockRejectedValue(testError);

    const { result } = renderHook(() => useCreateProjectHandler());

    const testData = {
      organizationId: "org-123",
      displayName: "Test Project",
      domainName: "test.com",
    };

    await expect(result.current(testData)).rejects.toThrow("API Error");
  });

  it("should be defined", () => {
    const { result } = renderHook(() => useCreateProjectHandler());
    expect(result.current).toBeDefined();
  });
});
