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
    { displayName: "Permission:Organizations", isGranted: true },
    { displayName: "Permission:Organizations.Create", isGranted: false },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock `useAtom` 状态
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_PROJECT_ATOM) {
        return [mockProjectId] as any; // 模拟 `projectId`
      }
      if (atom === PROJECT_PERMISSION_ATOM) {
        return [mockPermissions, mockSetPermissions]; // 模拟 `permissions` 和 `setPermissions`
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
      { displayName: "Permission:Organizations", isGranted: true },
      { displayName: "Permission:Organizations.Create", isGranted: false },
    ];

    // Mock API 返回值
    vi.mocked(getProjectPermissions).mockResolvedValue(mockPermissions as any);

    const { result } = renderHook(() => useProjectPermissions());

    // 等待 Hook 中异步调用完成
    await act(async () => {});

    // 验证 API 调用
    expect(getProjectPermissions).toHaveBeenCalledWith(mockProjectId);

    // 验证权限数据是否正确存储
    expect(mockSetPermissions).toHaveBeenCalledWith(mockPermissions);

    // 验证返回权限映射
    expect(result.current).toEqual({
      projects: true,
      projectsCreate: false,
    });
  });

  it("should handle API error and show toast message", async () => {
    const mockError = new Error("Failed to fetch permissions");

    // Mock API 抛出异常
    vi.mocked(getProjectPermissions).mockRejectedValue(mockError);

    renderHook(() => useProjectPermissions());

    // 等待 Hook 中异步调用完成
    await act(async () => {});

    // 验证错误 toast 被调用
    expect(mockToast).toHaveBeenCalledWith({
      description: "Failed to fetch permissions",
    });

    // 验证 `setPermissions` 未被调用
    expect(mockSetPermissions).not.toHaveBeenCalled();
  });

  it("should return empty permissions object when permissions are null", () => {
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === PROJECT_PERMISSION_ATOM) {
        return [null, mockSetPermissions] as any; // 模拟 `permissions` 为 null
      }
      return [null];
    });

    const { result } = renderHook(() => useProjectPermissions());

    // 验证返回的权限对象为空
    expect(result.current).toEqual({});
  });

  it("should return empty permissions object when permissions are empty array", () => {
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === PROJECT_PERMISSION_ATOM) {
        return [[], mockSetPermissions] as any; // 模拟 `permissions` 为空数组
      }
      return [null];
    });

    const { result } = renderHook(() => useProjectPermissions());

    // 验证返回的权限对象为空
    expect(result.current).toEqual({});
  });

  it("should trigger API when projectId changes", async () => {
    const mockNewProjectId = "project-456";

    const { rerender } = renderHook(() => useProjectPermissions());

    // 模拟更新 Atom 中的 `projectId`
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_PROJECT_ATOM) {
        return [mockNewProjectId] as any;
      }
      if (atom === PROJECT_PERMISSION_ATOM) {
        return [null, mockSetPermissions];
      }
      return [null];
    });

    // 重新渲染 Hook，触发 `useEffect`
    rerender();

    // 等待 Hook 内异步操作完成
    await act(async () => {});

    // 验证新项目权限 API 被调用
    expect(getProjectPermissions).toHaveBeenCalledWith(mockNewProjectId);
  });

  it("should not call API if projectId is null", async () => {
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_PROJECT_ATOM) {
        return [null] as any; // 模拟 `projectId` 为 null
      }
      if (atom === PROJECT_PERMISSION_ATOM) {
        return [null, mockSetPermissions];
      }
      return [null];
    });

    renderHook(() => useProjectPermissions());

    // 验证 API 不应被调用
    expect(getProjectPermissions).not.toHaveBeenCalled();
  });
});
