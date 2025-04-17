import { getOrganizationPermissions } from "@/api/utils/organization";
import { useToast } from "@/hooks/use-toast";
import { useOrgPermissions } from "@/hooks/useOrgPermissions";
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
});
