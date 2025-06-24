import { useLogout } from "@/hooks/useLogout";
import { renderHook } from "@testing-library/react";
import * as Jotai from "jotai";
import { RESET } from "jotai/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("jotai", async () => {
  const actual = await vi.importActual("jotai");
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});

describe("useLogout Hook", () => {
  const atomNames = [
    "ORGANIZATIONS_LIST_ATOM",
    "CURRENT_ORGANIZATION_ATOM",
    "PROJECT_LIST_ATOM",
    "CURRENT_PROJECT_ATOM",
    "accessTokenAtom",
    "refreshTokenAtom",
    "USER_PROFILE_ATOM",
    "PROJECT_PERMISSION_ATOM",
    "ORGANIZATION_PERMISSION_ATOM",
    "CURRENT_PROJECT_ROLE_ATOM",
    "CURRENT_ORGANIZATION_ROLE_ATOM",
    "ORGANIZATION_MEMBER_ATOM",
    "USER_LOGIN_TYPE",
    "DLL_LIST_ATOM",
    "RESTART_POD_SERVER_ATOM",
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should reset all atoms when logout is called", () => {
    const resetMock = vi.fn();
    vi.mocked(Jotai.useAtom).mockReturnValue([null, resetMock] as any);

    const { result } = renderHook(() => useLogout());
    result.current();

    // Verify that resetMock was called exactly once for each atom
    expect(resetMock).toHaveBeenCalledTimes(atomNames.length);
    expect(resetMock).toHaveBeenCalledWith(RESET);
  });

  it("should reset each individual atom with RESET value", () => {
    const mockSetters = atomNames.map(() => vi.fn());
    let currentSetterIndex = 0;

    vi.mocked(Jotai.useAtom).mockImplementation(() => {
      const setter = mockSetters[currentSetterIndex];
      currentSetterIndex = (currentSetterIndex + 1) % atomNames.length;
      return [null, setter] as any;
    });

    const { result } = renderHook(() => useLogout());
    result.current();

    // Verify each atom setter was called with RESET
    mockSetters.forEach((setter) => {
      expect(setter).toHaveBeenCalledWith(RESET);
      expect(setter).toHaveBeenCalledTimes(1);
    });
  });

  it("should propagate errors if atom reset fails", () => {
    const mockSetters = atomNames.map(() =>
      vi.fn().mockImplementation(() => {
        throw new Error("Reset failed");
      }),
    );
    let currentSetterIndex = 0;

    vi.mocked(Jotai.useAtom).mockImplementation(() => {
      const setter = mockSetters[currentSetterIndex];
      currentSetterIndex = (currentSetterIndex + 1) % atomNames.length;
      return [null, setter] as any;
    });

    const { result } = renderHook(() => useLogout());

    // Should throw error when called
    expect(() => result.current()).toThrow("Reset failed");

    // Verify that setter was called before error
    expect(mockSetters[0]).toHaveBeenCalledWith(RESET);
  });
});
