import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSideBarParams } from "./useSideBarParams";

// Mock dependencies
vi.mock("@/constants/sideBar", () => ({
  MENU_LIST: ["profile", "settings"],
  TAB_LIST: ["general", "apikeys", "configuration", "workflows"],
}));

vi.mock("@/hooks/useProjectPermissions", () => ({
  useProjectPermissions: vi.fn(),
}));

vi.mock("wouter", () => ({
  useLocation: vi.fn(),
  useParams: vi.fn(),
}));

import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import { useLocation, useParams } from "wouter";

const mockUseProjectPermissions = vi.mocked(useProjectPermissions);
const mockUseLocation = vi.mocked(useLocation);
const mockUseParams = vi.mocked(useParams);

describe("useSideBarParams", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLocation.mockReturnValue(["/dashboard"]);
    mockUseParams.mockReturnValue({});
  });

  it("should return profile and general when no params and no permissions", () => {
    mockUseProjectPermissions.mockReturnValue({
      apiKeys: false,
      plugins: false,
      corsOrigins: false,
    } as any);

    const { result } = renderHook(() => useSideBarParams());

    expect(result.current).toEqual(["profile", "workflows"]);
  });

  it("should return apikeys tab when user has apiKeys permission", () => {
    mockUseProjectPermissions.mockReturnValue({
      apiKeys: true,
      plugins: false,
      corsOrigins: false,
    } as any);

    const { result } = renderHook(() => useSideBarParams());

    expect(result.current).toEqual(["profile", "apikeys"]);
  });

  it("should return configuration tab when user has plugins permission", () => {
    mockUseProjectPermissions.mockReturnValue({
      apiKeys: false,
      plugins: true,
      corsOrigins: false,
    } as any);

    const { result } = renderHook(() => useSideBarParams());

    expect(result.current).toEqual(["profile", "configuration"]);
  });

  it("should return configuration tab when user has corsOrigins permission", () => {
    mockUseProjectPermissions.mockReturnValue({
      apiKeys: false,
      plugins: false,
      corsOrigins: true,
    } as any);

    const { result } = renderHook(() => useSideBarParams());

    expect(result.current).toEqual(["profile", "configuration"]);
  });

  it("should return configuration tab when user has both plugins and corsOrigins permissions", () => {
    mockUseProjectPermissions.mockReturnValue({
      apiKeys: false,
      plugins: true,
      corsOrigins: true,
    } as any);

    const { result } = renderHook(() => useSideBarParams());

    expect(result.current).toEqual(["profile", "configuration"]);
  });

  it("should prioritize apiKeys over configuration permissions", () => {
    mockUseProjectPermissions.mockReturnValue({
      apiKeys: true,
      plugins: true,
      corsOrigins: true,
    } as any);

    const { result } = renderHook(() => useSideBarParams());

    expect(result.current).toEqual(["profile", "apikeys"]);
  });

  it("should return general tab when not on dashboard path", () => {
    mockUseLocation.mockReturnValue(["/profile"]);
    mockUseProjectPermissions.mockReturnValue({
      apiKeys: true,
      plugins: false,
      corsOrigins: false,
    } as any);

    const { result } = renderHook(() => useSideBarParams());

    expect(result.current).toEqual(["profile", "general"]);
  });

  it("should use provided tab param when valid", () => {
    mockUseParams.mockReturnValue({ tab: "configuration" });
    mockUseProjectPermissions.mockReturnValue({
      apiKeys: false,
      plugins: false,
      corsOrigins: false,
    } as any);

    const { result } = renderHook(() => useSideBarParams());

    expect(result.current).toEqual(["profile", "configuration"]);
  });

  it("should use provided menu param when valid", () => {
    mockUseParams.mockReturnValue({ menu: "settings" });
    mockUseProjectPermissions.mockReturnValue({
      apiKeys: false,
      plugins: false,
      corsOrigins: false,
    } as any);

    const { result } = renderHook(() => useSideBarParams());

    expect(result.current).toEqual(["settings", "workflows"]);
  });

  it("should use both provided params when valid", () => {
    mockUseParams.mockReturnValue({ tab: "apikeys", menu: "settings" });
    mockUseProjectPermissions.mockReturnValue({
      apiKeys: false,
      plugins: false,
      corsOrigins: false,
    } as any);

    const { result } = renderHook(() => useSideBarParams());

    expect(result.current).toEqual(["settings", "apikeys"]);
  });

  it("should fallback to default when invalid tab param", () => {
    mockUseParams.mockReturnValue({ tab: "invalid" });
    mockUseProjectPermissions.mockReturnValue({
      apiKeys: true,
      plugins: false,
      corsOrigins: false,
    } as any);

    const { result } = renderHook(() => useSideBarParams());

    expect(result.current).toEqual(["profile", "apikeys"]);
  });

  it("should fallback to default when invalid menu param", () => {
    mockUseParams.mockReturnValue({ menu: "invalid" });
    mockUseProjectPermissions.mockReturnValue({
      apiKeys: false,
      plugins: false,
      corsOrigins: false,
    } as any);

    const { result } = renderHook(() => useSideBarParams());

    expect(result.current).toEqual(["profile", "workflows"]);
  });

  it("should handle undefined params", () => {
    mockUseParams.mockReturnValue(undefined);
    mockUseProjectPermissions.mockReturnValue({
      apiKeys: false,
      plugins: false,
      corsOrigins: false,
    } as any);

    const { result } = renderHook(() => useSideBarParams());

    expect(result.current).toEqual(["profile", "workflows"]);
  });

  it("should handle null params", () => {
    mockUseParams.mockReturnValue(null);
    mockUseProjectPermissions.mockReturnValue({
      apiKeys: false,
      plugins: false,
      corsOrigins: false,
    } as any);

    const { result } = renderHook(() => useSideBarParams());

    expect(result.current).toEqual(["profile", "workflows"]);
  });

  it("should handle dashboard path with permissions", () => {
    mockUseLocation.mockReturnValue(["/dashboard/apikeys"]);
    mockUseProjectPermissions.mockReturnValue({
      apiKeys: true,
      plugins: false,
      corsOrigins: false,
    } as any);

    const { result } = renderHook(() => useSideBarParams());

    expect(result.current).toEqual(["profile", "apikeys"]);
  });

  it("should handle non-dashboard path with permissions", () => {
    mockUseLocation.mockReturnValue(["/profile/settings"]);
    mockUseProjectPermissions.mockReturnValue({
      apiKeys: true,
      plugins: false,
      corsOrigins: false,
    } as any);

    const { result } = renderHook(() => useSideBarParams());

    expect(result.current).toEqual(["profile", "general"]);
  });
});
