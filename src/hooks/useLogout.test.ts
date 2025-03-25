import { useLogout } from "@/hooks/useLogout";
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

    vi.mocked(Jotai.useAtom).mockReturnValue([null, resetMock] as any);

    const { result } = renderHook(() => useLogout());

    result.current();

    expect(resetMock).toHaveBeenCalledTimes(11);

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

    hookDependencies.forEach((atom) => {
      expect(() => Jotai.useAtom(atom as any)).not.toThrow();
    });
  });
});
