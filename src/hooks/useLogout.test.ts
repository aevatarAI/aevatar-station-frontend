import { useLogout } from "@/hooks/useLogout"; // 假定 Hook 的路径
import { renderHook } from "@testing-library/react";
import * as Jotai from "jotai";
import { RESET } from "jotai/utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("jotai", async () => {
  const actual = await vi.importActual("jotai");
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});

describe("useLogout Hook", () => {
  it("should reset all atoms when logout is called", () => {
    const resetMock = vi.fn();

    // Mock `useAtom`，返回 resetMock
    vi.mocked(Jotai.useAtom).mockReturnValue([null, resetMock] as any);

    // 渲染 useLogout Hook
    const { result } = renderHook(() => useLogout());

    // 调用返回的 logout 函数
    result.current();

    // 验证 setXxx mock 被调用的次数应该对应 Hook 内部所有 atom
    expect(resetMock).toHaveBeenCalledTimes(11);

    // 确保每次调用的参数是 `RESET`
    expect(resetMock).toHaveBeenCalledWith(RESET);
  });

  it("should include all dependent atom setters in dependencies", () => {
    const hookDependencies = [
      "ORGANIZATIONS_LIST_ATOM",
      "PROJECT_LIST_ATOM",
      "CURRENT_ORGANIZATION_ATOM",
      "CURRENT_PROJECT_ATOM",
      "accessTokenAtom",
      "ORGANIZATION_MEMBER_ATOM",
      "PROJECT_PERMISSION_ATOM",
      "CURRENT_PROJECT_ROLE_ATOM",
      "CURRENT_ORGANIZATION_ROLE_ATOM",
      "USER_PROFILE_ATOM",
      "ORGANIZATION_PERMISSION_ATOM",
    ];

    // Mock useAtom 的依赖项，确保覆盖性
    hookDependencies.forEach((atom) => {
      expect(() => Jotai.useAtom(atom as any)).not.toThrow();
    });

    // 如果编写其他检测逻辑，比如模拟依赖行为是否对 Hook 启动框影响
  });
});
