import { getProjectPermissions } from "@/api/utils/project";
import { useToast } from "@/hooks/use-toast";
import {
  useGetProjectPermissions,
  useProjectPermissions,
} from "@/hooks/useProjectPermissions";
import { CURRENT_PROJECT_ATOM } from "@/state/atoms/organisation";
import { PROJECT_PERMISSION_ATOM } from "@/state/atoms/permissions";
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

vi.mock("@/api/utils/project", () => ({
  getProjectPermissions: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

describe("useProjectPermissions Hook", () => {
  const mockProjectId = "project-123";
  const mockSetPermissions = vi.fn();
  const mockToast = vi.fn();
  const mockPermissions = [
    { displayName: "Permission:Projects", isGranted: true },
    { displayName: "Permission:Projects.Create", isGranted: false },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_PROJECT_ATOM) {
        return [mockProjectId] as any;
      }
      if (atom === PROJECT_PERMISSION_ATOM) {
        return [mockPermissions, mockSetPermissions];
      }
      return [null];
    });

    // Mock Toast Hook
    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch and set project permissions correctly", async () => {
    const mockPermissions = [
      { displayName: "Permission:Projects", isGranted: true },
      { displayName: "Permission:Projects.Create", isGranted: false },
    ];

    vi.mocked(getProjectPermissions).mockResolvedValue(mockPermissions as any);

    const { result } = renderHook(() => useProjectPermissions());

    await act(async () => {});

    expect(getProjectPermissions).toHaveBeenCalledWith(mockProjectId);

    expect(mockSetPermissions).toHaveBeenCalledWith(mockPermissions);
    expect(result.current).toEqual({
      projects: true,
      projectsCreate: false,
    });
  });

  it("should handle API error and show toast message", async () => {
    const mockError = new Error("Failed to fetch permissions");

    vi.mocked(getProjectPermissions).mockRejectedValue(mockError);

    renderHook(() => useProjectPermissions());

    await act(async () => {});

    expect(mockToast).toHaveBeenCalledWith({
      description: "Failed to fetch permissions",
    });

    expect(mockSetPermissions).not.toHaveBeenCalled();
  });

  it("should return empty permissions object when permissions are null", () => {
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === PROJECT_PERMISSION_ATOM) {
        return [null, mockSetPermissions] as any;
      }
      return [null];
    });

    const { result } = renderHook(() => useProjectPermissions());

    expect(result.current).toEqual({});
  });

  it("should return empty permissions object when permissions are empty array", () => {
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === PROJECT_PERMISSION_ATOM) {
        return [[], mockSetPermissions] as any;
      }
      return [null];
    });

    const { result } = renderHook(() => useProjectPermissions());

    expect(result.current).toEqual({});
  });

  it("should trigger API when projectId changes", async () => {
    const mockNewProjectId = "project-456";

    const { rerender } = renderHook(() => useProjectPermissions());

    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_PROJECT_ATOM) {
        return [mockNewProjectId] as any;
      }
      if (atom === PROJECT_PERMISSION_ATOM) {
        return [null, mockSetPermissions];
      }
      return [null];
    });

    rerender();

    await act(async () => {});

    expect(getProjectPermissions).toHaveBeenCalledWith(mockNewProjectId);
  });

  it("should not call API if projectId is null", async () => {
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_PROJECT_ATOM) {
        return [null] as any;
      }
      if (atom === PROJECT_PERMISSION_ATOM) {
        return [null, mockSetPermissions];
      }
      return [null];
    });

    renderHook(() => useProjectPermissions());

    expect(getProjectPermissions).not.toHaveBeenCalled();
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
      { displayName: "Permission:Plugins", isGranted: false },
      { displayName: "Permission:Plugins.Create", isGranted: true },
      { displayName: "Permission:Plugins.Edit", isGranted: false },
      { displayName: "Permission:Plugins.Delete", isGranted: true },
      { displayName: "Permission:ProjectCorsOrigins", isGranted: false },
      { displayName: "Permission:ProjectCorsOrigins.Create", isGranted: true },
      { displayName: "Permission:ProjectCorsOrigins.Edit", isGranted: false },
      { displayName: "Permission:ProjectCorsOrigins.Delete", isGranted: true },
    ];

    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_PROJECT_ATOM) {
        return [mockProjectId] as any;
      }
      if (atom === PROJECT_PERMISSION_ATOM) {
        return [allPermissions, mockSetPermissions];
      }
      return [null];
    });

    const { result } = renderHook(() => useProjectPermissions());

    expect(result.current).toEqual({
      organizations: true,
      organizationsCreate: true,
      organizationsEdit: false,
      organizationsDelete: true,
      projects: true,
      projectsCreate: false,
      projectsEdit: true,
      projectsDelete: false,
      member: true,
      memberManage: false,
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
      plugins: false,
      pluginsCreate: true,
      pluginsEdit: false,
      pluginsDelete: true,
      corsOrigins: false,
      corsOriginsCreate: true,
      corsOriginsEdit: false,
      corsOriginsDelete: true,
    });
  });

  it("should handle unknown permission types", () => {
    const unknownPermissions = [
      { displayName: "Permission:Unknown", isGranted: true },
      { displayName: "Permission:AnotherUnknown", isGranted: false },
    ];

    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_PROJECT_ATOM) {
        return [mockProjectId] as any;
      }
      if (atom === PROJECT_PERMISSION_ATOM) {
        return [unknownPermissions, mockSetPermissions];
      }
      return [null];
    });

    const { result } = renderHook(() => useProjectPermissions());

    expect(result.current).toEqual({});
  });

  it("should handle permissions with undefined isGranted", () => {
    const undefinedPermissions = [
      { displayName: "Permission:Projects", isGranted: undefined },
      { displayName: "Permission:Projects.Create", isGranted: null },
    ];

    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_PROJECT_ATOM) {
        return [mockProjectId] as any;
      }
      if (atom === PROJECT_PERMISSION_ATOM) {
        return [undefinedPermissions, mockSetPermissions];
      }
      return [null];
    });

    const { result } = renderHook(() => useProjectPermissions());

    expect(result.current).toEqual({
      projects: undefined,
      projectsCreate: null,
    });
  });
});

describe("useGetProjectPermissions Hook", () => {
  const mockProjectId = "project-123";
  const mockSetPermissions = vi.fn();
  const mockPermissions = [
    { displayName: "Permission:Projects", isGranted: true },
    { displayName: "Permission:Projects.Create", isGranted: false },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_PROJECT_ATOM) {
        return [mockProjectId] as any;
      }
      if (atom === PROJECT_PERMISSION_ATOM) {
        return [null, mockSetPermissions];
      }
      return [null];
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch permissions for given project ID", async () => {
    vi.mocked(getProjectPermissions).mockResolvedValue(mockPermissions as any);

    const { result } = renderHook(() => useGetProjectPermissions());

    const permissions = await result.current("project-456");

    expect(getProjectPermissions).toHaveBeenCalledWith("project-456");
    expect(permissions).toEqual({
      projects: true,
      projectsCreate: false,
    });
  });

  it("should set permissions if project ID matches current project", async () => {
    vi.mocked(getProjectPermissions).mockResolvedValue(mockPermissions as any);

    const { result } = renderHook(() => useGetProjectPermissions());

    await result.current(mockProjectId);

    expect(mockSetPermissions).toHaveBeenCalledWith(mockPermissions);
  });

  it("should not set permissions if project ID does not match current project", async () => {
    vi.mocked(getProjectPermissions).mockResolvedValue(mockPermissions as any);

    const { result } = renderHook(() => useGetProjectPermissions());

    await result.current("different-project-id");

    expect(mockSetPermissions).not.toHaveBeenCalled();
  });

  it("should handle API errors", async () => {
    const mockError = new Error("API Error");
    vi.mocked(getProjectPermissions).mockRejectedValue(mockError);

    const { result } = renderHook(() => useGetProjectPermissions());

    await expect(result.current("project-456")).rejects.toThrow("API Error");
  });
});
