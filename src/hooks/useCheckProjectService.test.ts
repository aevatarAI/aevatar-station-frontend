import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCheckProjectService } from "./useCheckProjectService";

// Mock the API utility
vi.mock("@/api/utils/plugin", () => ({
  getRestartStatus: vi.fn(),
}));

// Mock the delay utility
vi.mock("@/utils/common", () => ({
  delay: vi.fn(),
}));

import { getRestartStatus } from "@/api/utils/plugin";
import { delay } from "@/utils/common";

describe("useCheckProjectService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a callback function", () => {
    const { result } = renderHook(() => useCheckProjectService());

    expect(typeof result.current).toBe("function");
  });

  it("should call getRestartStatus with correct domain", async () => {
    const mockDomain = "test-domain";
    vi.mocked(getRestartStatus).mockResolvedValue(true);

    const { result } = renderHook(() => useCheckProjectService());

    await result.current(mockDomain);

    expect(getRestartStatus).toHaveBeenCalledWith("test-domain-client");
  });

  it("should finish when getRestartStatus returns true", async () => {
    const mockDomain = "test-domain";
    vi.mocked(getRestartStatus).mockResolvedValue(true);

    const { result } = renderHook(() => useCheckProjectService());

    await result.current(mockDomain);

    expect(getRestartStatus).toHaveBeenCalledTimes(1);
    expect(delay).not.toHaveBeenCalled();
  });

  it("should retry when getRestartStatus returns false", async () => {
    const mockDomain = "test-domain";
    vi.mocked(getRestartStatus)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);
    vi.mocked(delay).mockResolvedValue(undefined);

    const { result } = renderHook(() => useCheckProjectService());

    await result.current(mockDomain);

    expect(getRestartStatus).toHaveBeenCalledTimes(3);
    expect(delay).toHaveBeenCalledTimes(2);
    expect(delay).toHaveBeenCalledWith(3000);
  });

  it("should be defined", () => {
    const { result } = renderHook(() => useCheckProjectService());
    expect(result.current).toBeDefined();
  });
});
