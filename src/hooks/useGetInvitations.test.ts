import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGetInvitations } from "./useGetInvitations";

// Mock utility functions
vi.mock("@/utils/helpers", () => ({
  deduplicate: vi.fn((arr) => arr || []),
  reverse: vi.fn((arr) => (arr ? [...arr].reverse() : [])),
}));

describe("useGetInvitations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with empty selectedValues", () => {
    const mockInvitations = [];
    const { result } = renderHook(() => useGetInvitations(mockInvitations));

    expect(result.current.selectedValues).toEqual([]);
    expect(result.current.hasInvites).toBe(false);
  });

  it("should process invitations data correctly", () => {
    const mockInvitations = [
      { id: "invite-1", organizationId: "org-1", name: "Invite 1" },
      { id: "invite-2", organizationId: "org-2", name: "Invite 2" },
    ];

    const { result } = renderHook(() => useGetInvitations(mockInvitations));

    expect(result.current.hasInvites).toBe(true);
  });

  it("should handle undefined invitations data", () => {
    const { result } = renderHook(() => useGetInvitations(undefined));

    expect(result.current.invites).toEqual([]);
    expect(result.current.hasInvites).toBe(false);
    expect(result.current.selectedValues).toEqual([]);
  });

  it("should return setSelectedValues function", () => {
    const mockInvitations = [];
    const { result } = renderHook(() => useGetInvitations(mockInvitations));

    expect(typeof result.current.setSelectedValues).toBe("function");
  });
});
