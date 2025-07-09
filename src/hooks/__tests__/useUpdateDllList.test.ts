import { getDllPlugins } from "@/api/utils/plugin";
import { DLL_LIST_ATOM } from "@/state/atoms/dll";
import { TestWrapper } from "@/test/test-utils";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useUpdateDllList } from "../useUpdateDllList";

// Mock the API call
vi.mock("@/api/utils/plugin", () => ({
  getDllPlugins: vi.fn(),
}));

describe("useUpdateDllList", () => {
  it("should update DLL list successfully", async () => {
    const mockDllList = [
      {
        id: "test-id",
        name: "test-dll",
        creationTime: Date.now(),
        creatorName: "test-creator",
      },
    ];

    (getDllPlugins as any).mockResolvedValueOnce(mockDllList);

    const { result } = renderHook(() => useUpdateDllList(), {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await result.current("test-project-id");
    });

    expect(getDllPlugins).toHaveBeenCalledWith("test-project-id", "");
  });

  it("should handle error and show toast", async () => {
    const mockError = new Error("Test error");
    (getDllPlugins as any).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useUpdateDllList(), {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await result.current("test-project-id");
    });

    expect(getDllPlugins).toHaveBeenCalledWith("test-project-id", "");
  });
});
