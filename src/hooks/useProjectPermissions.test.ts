import { getProjectPermissions } from "@/api/utils/project";
import { useToast } from "@/hooks/use-toast";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
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
    console.log(result.current, "result.current==");
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
});
