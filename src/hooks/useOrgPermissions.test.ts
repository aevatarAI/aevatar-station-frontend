import { getOrganizationPermissions } from "@/api/utils/organization";
import { useToast } from "@/hooks/use-toast";
import {
  useGetOrgPermissions,
  useOrgPermissions,
} from "@/hooks/useOrgPermissions";
import { CURRENT_ORGANIZATION_ATOM } from "@/state/atoms/organisation";
import { ORGANIZATION_PERMISSION_ATOM } from "@/state/atoms/permissions";
import { act, renderHook } from "@testing-library/react";
import { useAtom } from "jotai";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("jotai", async () => {
  const actual = await vi.importActual("jotai");
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});

vi.mock("@/api/utils/organization", () => ({
  getOrganizationPermissions: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

describe("useOrgPermissions Hook", () => {
  const mockOrganizationId = "organization-123";
  const mockSetPermissions = vi.fn();
  const mockToast = vi.fn();
  const mockPermissions = [
    { displayName: "Permission:Organizations", isGranted: true },
    { displayName: "Permission:Organizations.Create", isGranted: false },
    { displayName: "Permission:Organizations.Edit", isGranted: true },
  ];
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_ORGANIZATION_ATOM) {
        return [mockOrganizationId] as any;
      }
      if (atom === ORGANIZATION_PERMISSION_ATOM) {
        return [mockPermissions, mockSetPermissions];
      }
      return [null];
    });

    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch organization permissions and set them correctly", async () => {
    vi.mocked(getOrganizationPermissions).mockResolvedValue(
      mockPermissions as any,
    );

    const { result } = renderHook(() => useOrgPermissions());

    await act(async () => {});

    expect(getOrganizationPermissions).toHaveBeenCalledWith(mockOrganizationId);

    expect(mockSetPermissions).toHaveBeenCalledWith(mockPermissions);

    expect(result.current).toEqual({
      organizations: true,
      organizationsCreate: false,
      organizationsEdit: true,
    });
  });

  it("should handle errors by showing toast", async () => {
    const mockError = new Error("Failed to fetch permissions");
    vi.mocked(getOrganizationPermissions).mockRejectedValue(mockError);

    renderHook(() => useOrgPermissions());

    await act(async () => {});

    expect(mockToast).toHaveBeenCalledWith({
      description: "Failed to fetch permissions",
    });

    expect(mockSetPermissions).not.toHaveBeenCalled();
  });

  it("should return empty permissions object if no data is set", async () => {
    vi.mocked(getOrganizationPermissions).mockResolvedValue([]);
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_ORGANIZATION_ATOM) {
        return [mockOrganizationId] as any;
      }
      if (atom === ORGANIZATION_PERMISSION_ATOM) {
        return [[], mockSetPermissions];
      }
      return [null];
    });
    const { result } = renderHook(() => useOrgPermissions());
    await act(async () => {});

    expect(result.current).toEqual({});
  });

  it("should not fetch permissions if organizationId is null", async () => {
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_ORGANIZATION_ATOM) {
        return [null] as any;
      }
      if (atom === ORGANIZATION_PERMISSION_ATOM) {
        return [null, mockSetPermissions];
      }
      return [null];
    });

    renderHook(() => useOrgPermissions());

    expect(getOrganizationPermissions).not.toHaveBeenCalled();
    expect(mockSetPermissions).not.toHaveBeenCalled();
  });

  it("should fetch permissions again if organizationId changes", async () => {
    const { rerender } = renderHook(() => useOrgPermissions());

    const mockNewOrganizationId = "organization-456";

    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_ORGANIZATION_ATOM) {
        return [mockNewOrganizationId] as any;
      }
      if (atom === ORGANIZATION_PERMISSION_ATOM) {
        return [null, mockSetPermissions];
      }
      return [null];
    });

    rerender();

    await act(async () => {});

    expect(getOrganizationPermissions).toHaveBeenCalledWith(
      mockNewOrganizationId,
    );
  });

  it("should map all permission types correctly", () => {
    const allPermissions = [
      { displayName: "Permission:Organizations", isGranted: true },
      { displayName: "Permission:Organizations.Create", isGranted: true },
      { displayName: "Permission:Organizations.Edit", isGranted: false },
      { displayName: "Permission:Organizations.Delete", isGranted: true },
      { displayName: "Permission:Projects", isGranted: true },
      { displayName: "Permission:Projects.Create", isGranted: false },
      { displayName: "Permission:Projects.Edit", isGranted: true },
      { displayName: "Permission:Projects.Delete", isGranted: false },
      { displayName: "Permission:Members", isGranted: true },
      { displayName: "Permission:Members.Manage", isGranted: false },
      { displayName: "Permission:ApiKeys", isGranted: true },
      { displayName: "Permission:ApiKeys.Create", isGranted: false },
      { displayName: "Permission:ApiKeys.Edit", isGranted: true },
      { displayName: "Permission:ApiKeys.Delete", isGranted: false },
      { displayName: "Permission:Roles", isGranted: true },
      { displayName: "Permission:Roles.Create", isGranted: false },
      { displayName: "Permission:Roles.Edit", isGranted: true },
      { displayName: "Permission:Roles.Delete", isGranted: false },
      { displayName: "Permission:Dashboards", isGranted: true },
      { displayName: "Permission:LLMSModels", isGranted: false },
      { displayName: "Permission:ApiRequests", isGranted: true },
    ];

    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_ORGANIZATION_ATOM) {
        return [mockOrganizationId] as any;
      }
      if (atom === ORGANIZATION_PERMISSION_ATOM) {
        return [allPermissions, mockSetPermissions];
      }
      return [null];
    });

    const { result } = renderHook(() => useOrgPermissions());

    expect(result.current).toEqual({
      organizations: true,
      organizationsCreate: true,
      organizationsEdit: false,
      organizationsDelete: true,
      projects: true,
      projectsCreate: false,
      projectsEdit: true,
      projectsDelete: false,
      organizationMembers: true,
      organizationMembersManage: false,
      apiKeys: true,
      apiKeysCreate: false,
      apiKeysEdit: true,
      apiKeysDelete: false,
      role: true,
      roleCreate: false,
      roleEdit: true,
      roleDelete: false,
      dashboards: true,
      llmsModels: false,
      apiRequests: true,
    });
  });

  it("should handle unknown permission types", () => {
    const unknownPermissions = [
      { displayName: "Permission:Unknown", isGranted: true },
      { displayName: "Permission:AnotherUnknown", isGranted: false },
    ];

    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_ORGANIZATION_ATOM) {
        return [mockOrganizationId] as any;
      }
      if (atom === ORGANIZATION_PERMISSION_ATOM) {
        return [unknownPermissions, mockSetPermissions];
      }
      return [null];
    });

    const { result } = renderHook(() => useOrgPermissions());

    expect(result.current).toEqual({});
  });

  it("should handle permissions with undefined isGranted", () => {
    const undefinedPermissions = [
      { displayName: "Permission:Organizations", isGranted: undefined },
      { displayName: "Permission:Organizations.Create", isGranted: null },
    ];

    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_ORGANIZATION_ATOM) {
        return [mockOrganizationId] as any;
      }
      if (atom === ORGANIZATION_PERMISSION_ATOM) {
        return [undefinedPermissions, mockSetPermissions];
      }
      return [null];
    });

    const { result } = renderHook(() => useOrgPermissions());

    expect(result.current).toEqual({
      organizations: undefined,
      organizationsCreate: null,
    });
  });
});

describe("useGetOrgPermissions Hook", () => {
  const mockOrganizationId = "organization-123";
  const mockSetPermissions = vi.fn();
  const mockPermissions = [
    { displayName: "Permission:Organizations", isGranted: true },
    { displayName: "Permission:Organizations.Create", isGranted: false },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_ORGANIZATION_ATOM) {
        return [mockOrganizationId] as any;
      }
      if (atom === ORGANIZATION_PERMISSION_ATOM) {
        return [null, mockSetPermissions];
      }
      return [null];
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch permissions for given organization ID", async () => {
    vi.mocked(getOrganizationPermissions).mockResolvedValue(
      mockPermissions as any,
    );

    const { result } = renderHook(() => useGetOrgPermissions());

    const permissions = await result.current("organization-456");

    expect(getOrganizationPermissions).toHaveBeenCalledWith("organization-456");
    expect(permissions).toEqual({
      organizations: true,
      organizationsCreate: false,
    });
  });

  it("should set permissions if organization ID matches current organization", async () => {
    vi.mocked(getOrganizationPermissions).mockResolvedValue(
      mockPermissions as any,
    );

    const { result } = renderHook(() => useGetOrgPermissions());

    await result.current(mockOrganizationId);

    expect(mockSetPermissions).toHaveBeenCalledWith(mockPermissions);
  });

  it("should not set permissions if organization ID does not match current organization", async () => {
    vi.mocked(getOrganizationPermissions).mockResolvedValue(
      mockPermissions as any,
    );

    const { result } = renderHook(() => useGetOrgPermissions());

    await result.current("different-organization-id");

    expect(mockSetPermissions).not.toHaveBeenCalled();
  });

  it("should handle API errors", async () => {
    const mockError = new Error("API Error");
    vi.mocked(getOrganizationPermissions).mockRejectedValue(mockError);

    const { result } = renderHook(() => useGetOrgPermissions());

    await expect(result.current("organization-456")).rejects.toThrow(
      "API Error",
    );
  });
});
