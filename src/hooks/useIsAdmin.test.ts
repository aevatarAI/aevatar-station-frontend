import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useIsAdmin } from "./useIsAdmin";

// Mock useOrgPermissions
vi.mock("@/hooks/useOrgPermissions", () => ({
  useOrgPermissions: vi.fn(),
}));

import { useOrgPermissions } from "@/hooks/useOrgPermissions";

describe("useIsAdmin", () => {
  const mockUseOrgPermissions = vi.mocked(useOrgPermissions);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return true when user has all API key permissions", () => {
    mockUseOrgPermissions.mockReturnValue({
      apiKeysCreate: true,
      apiKeysDelete: true,
      apiKeysEdit: true,
      organizationMembersManage: false,
      organizationsCreate: false,
      organizationsDelete: false,
      organizationsEdit: false,
      projectsCreate: false,
      projectsEdit: false,
      projectsDelete: false,
    } as any);

    const { result } = renderHook(() => useIsAdmin());

    expect(result.current).toBe(true);
  });

  it("should return true when user has all project permissions", () => {
    mockUseOrgPermissions.mockReturnValue({
      apiKeysCreate: false,
      apiKeysDelete: false,
      apiKeysEdit: false,
      organizationMembersManage: false,
      organizationsCreate: false,
      organizationsDelete: false,
      organizationsEdit: false,
      projectsCreate: true,
      projectsEdit: true,
      projectsDelete: true,
    } as any);

    const { result } = renderHook(() => useIsAdmin());

    expect(result.current).toBe(true);
  });

  it("should return true when user has all organization permissions", () => {
    mockUseOrgPermissions.mockReturnValue({
      apiKeysCreate: false,
      apiKeysDelete: false,
      apiKeysEdit: false,
      organizationMembersManage: false,
      organizationsCreate: true,
      organizationsDelete: true,
      organizationsEdit: true,
      projectsCreate: false,
      projectsEdit: false,
      projectsDelete: false,
    } as any);

    const { result } = renderHook(() => useIsAdmin());

    expect(result.current).toBe(true);
  });

  it("should return true when user has organization members manage permission", () => {
    mockUseOrgPermissions.mockReturnValue({
      apiKeysCreate: false,
      apiKeysDelete: false,
      apiKeysEdit: false,
      organizationMembersManage: true,
      organizationsCreate: false,
      organizationsDelete: false,
      organizationsEdit: false,
      projectsCreate: false,
      projectsEdit: false,
      projectsDelete: false,
    } as any);

    const { result } = renderHook(() => useIsAdmin());

    expect(result.current).toBe(true);
  });

  it("should return false when user has no admin permissions", () => {
    mockUseOrgPermissions.mockReturnValue({
      apiKeysCreate: false,
      apiKeysDelete: false,
      apiKeysEdit: false,
      organizationMembersManage: false,
      organizationsCreate: false,
      organizationsDelete: false,
      organizationsEdit: false,
      projectsCreate: false,
      projectsEdit: false,
      projectsDelete: false,
    } as any);

    const { result } = renderHook(() => useIsAdmin());

    expect(result.current).toBe(false);
  });

  it("should return false when user has partial permissions", () => {
    mockUseOrgPermissions.mockReturnValue({
      apiKeysCreate: true,
      apiKeysDelete: false,
      apiKeysEdit: true,
      organizationMembersManage: false,
      organizationsCreate: false,
      organizationsDelete: false,
      organizationsEdit: false,
      projectsCreate: false,
      projectsEdit: false,
      projectsDelete: false,
    } as any);

    const { result } = renderHook(() => useIsAdmin());

    expect(result.current).toBe(false);
  });

  it("should return true when user has mixed permissions", () => {
    mockUseOrgPermissions.mockReturnValue({
      apiKeysCreate: true,
      apiKeysDelete: true,
      apiKeysEdit: true,
      organizationMembersManage: false,
      organizationsCreate: true,
      organizationsDelete: false,
      organizationsEdit: true,
      projectsCreate: false,
      projectsEdit: false,
      projectsDelete: false,
    } as any);

    const { result } = renderHook(() => useIsAdmin());

    expect(result.current).toBe(true);
  });
});
