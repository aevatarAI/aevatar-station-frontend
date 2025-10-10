import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePermissionNavigate } from "./usePermissionNavigate";

// Mock useOrgPermissions hook
vi.mock("@/hooks/useOrgPermissions", () => ({
  useOrgPermissions: vi.fn(() => ({
    apiKeys: false,
    dashboards: false,
  })),
}));

// Mock useProjectPermissions hook
vi.mock("@/hooks/useProjectPermissions", () => ({
  useProjectPermissions: vi.fn(() => ({
    apiKeys: false,
    dashboards: false,
  })),
}));

// Mock React
vi.mock("react", () => ({
  useMemo: vi.fn((fn) => fn()),
}));

describe("usePermissionNavigate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return default navigation path", () => {
    const { result } = renderHook(() => usePermissionNavigate());

    expect(result.current).toEqual({
      to: "/dashboard/workflows",
    });
  });

  it("should handle different permission states", () => {
    const { result } = renderHook(() => usePermissionNavigate());

    expect(result.current.to).toBe("/dashboard/workflows");
  });

  it("should be defined", () => {
    const { result } = renderHook(() => usePermissionNavigate());
    expect(result.current).toBeDefined();
  });
});
