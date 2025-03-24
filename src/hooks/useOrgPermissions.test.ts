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
    // 清空 Mock 的调用记录
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
    // 清除 Mock 数据
    vi.resetAllMocks();
  });

  it("should fetch organization permissions and set them correctly", async () => {
    vi.mocked(getOrganizationPermissions).mockResolvedValue(
      mockPermissions as any,
    );

    // 调用 Hook
    const { result } = renderHook(() => useOrgPermissions());

    // 等待 Hook 内部 effect 逻辑执行完成
    await act(async () => {});

    // 验证 API 调用是否传递 organizationId
    expect(getOrganizationPermissions).toHaveBeenCalledWith(mockOrganizationId);

    // 验证权限被正确设置
    expect(mockSetPermissions).toHaveBeenCalledWith(mockPermissions);

    // 验证返回的权限 Mapping 结果
    expect(result.current).toEqual({
      organizations: true,
      organizationsCreate: false,
      organizationsEdit: true,
    });
  });

  it("should handle errors by showing toast", async () => {
    // 模拟 API 抛出错误
    const mockError = new Error("Failed to fetch permissions");
    vi.mocked(getOrganizationPermissions).mockRejectedValue(mockError);

    // 调用 Hook
    renderHook(() => useOrgPermissions());

    // 等待 Hook 内部 effect 逻辑执行完成
    await act(async () => {});

    // 验证 toast 被调用
    expect(mockToast).toHaveBeenCalledWith({
      description: "Failed to fetch permissions",
    });

    // 验证没有设置权限
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
    // 调用 Hook
    const { result } = renderHook(() => useOrgPermissions());
    console.log(result, "result=====");
    // 等待初始化完成
    await act(async () => {});

    // 验证返回的权限 Mapping 为空对象
    expect(result.current).toEqual({});
  });

  it("should not fetch permissions if organizationId is null", async () => {
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_ORGANIZATION_ATOM) {
        return [null] as any; // 模拟 organizationId 为 null
      }
      if (atom === ORGANIZATION_PERMISSION_ATOM) {
        return [null, mockSetPermissions];
      }
      return [null];
    });

    // 调用 Hook
    renderHook(() => useOrgPermissions());

    // 验证 API 不被调用
    expect(getOrganizationPermissions).not.toHaveBeenCalled();
    expect(mockSetPermissions).not.toHaveBeenCalled();
  });

  it("should fetch permissions again if organizationId changes", async () => {
    const { rerender } = renderHook(() => useOrgPermissions());

    const mockNewOrganizationId = "organization-456";

    // 模拟更新 organizationId
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

    // 等待 Hook 逻辑执行
    await act(async () => {});

    // 验证 API 被调用
    expect(getOrganizationPermissions).toHaveBeenCalledWith(
      mockNewOrganizationId,
    );
  });
});
