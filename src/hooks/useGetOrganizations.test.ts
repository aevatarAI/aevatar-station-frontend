import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGetOrganizations } from "./useGetOrganizations";

// Mock dependencies
vi.mock("@/api", () => ({
  request: {
    organizations: {
      getUserOrganizations: vi.fn(),
    },
  },
}));

vi.mock("@/hooks/navigate", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("@/hooks/useEmail", () => ({
  useEmail: vi.fn(),
}));

// Mock React Query
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

import { request } from "@/api";
import { useNavigate } from "@/hooks/navigate";
import { useEmail } from "@/hooks/useEmail";
import { useQuery } from "@tanstack/react-query";

const mockRequest = vi.mocked(request);
const mockUseNavigate = vi.mocked(useNavigate);
const mockUseEmail = vi.mocked(useEmail);
const mockUseQuery = vi.mocked(useQuery);

describe("useGetOrganizations", () => {
  const mockNavigate = vi.fn();
  const mockEmail = "test@example.com";

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNavigate.mockReturnValue(mockNavigate);
    mockUseEmail.mockReturnValue(mockEmail);
  });

  it("should call useQuery with correct parameters when email is provided", () => {
    const mockData = { organizations: ["org1", "org2"] };
    mockRequest.organizations.getUserOrganizations.mockResolvedValue(mockData);
    mockUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    useGetOrganizations();

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["organisation", { email: mockEmail }],
      queryFn: expect.any(Function),
      enabled: true,
    });
  });

  it("should call getUserOrganizations API when queryFn is executed", async () => {
    const mockData = { organizations: ["org1", "org2"] };
    mockRequest.organizations.getUserOrganizations.mockResolvedValue(mockData);
    mockUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    useGetOrganizations();

    // Get the queryFn from the mock call
    const queryFn = mockUseQuery.mock.calls[0][0].queryFn;
    await queryFn();

    expect(
      mockRequest.organizations.getUserOrganizations,
    ).toHaveBeenCalledTimes(1);
  });

  it("should be enabled when email is provided", () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    useGetOrganizations();

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["organisation", { email: mockEmail }],
      queryFn: expect.any(Function),
      enabled: true,
    });
  });

  it("should be disabled when email is empty", () => {
    mockUseEmail.mockReturnValue("");
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    useGetOrganizations();

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["organisation", { email: "" }],
      queryFn: expect.any(Function),
      enabled: false,
    });
  });

  it("should be disabled when email is null", () => {
    mockUseEmail.mockReturnValue(null as any);
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    useGetOrganizations();

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["organisation", { email: null }],
      queryFn: expect.any(Function),
      enabled: false,
    });
  });

  it("should handle API success", async () => {
    const mockData = { organizations: ["org1", "org2"] };
    mockRequest.organizations.getUserOrganizations.mockResolvedValue(mockData);
    mockUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    const result = useGetOrganizations();

    expect(result.data).toEqual(mockData);
    expect(result.isError).toBe(false);
  });

  it("should navigate to welcome page on API error", async () => {
    const mockError = new Error("API Error");
    mockRequest.organizations.getUserOrganizations.mockRejectedValue(mockError);
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    useGetOrganizations();

    // Get the queryFn from the mock call
    const queryFn = mockUseQuery.mock.calls[0][0].queryFn;
    const result = await queryFn();

    expect(result).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/welcome");
  });

  it("should return null data on API error", async () => {
    const mockError = new Error("API Error");
    mockRequest.organizations.getUserOrganizations.mockRejectedValue(mockError);
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    const result = useGetOrganizations();

    expect(result.data).toBeNull();
  });
});
