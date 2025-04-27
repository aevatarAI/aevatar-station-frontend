import { useNavigate } from "@/hooks/navigate";
import { useGetUnreadNotifications } from "@/hooks/useGetUnreadNotifications";
import { useOrgPermissions } from "@/hooks/useOrgPermissions";
import { usePostReadNotifications } from "@/hooks/usePostReadNotifications";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import { useSideBarParams } from "@/hooks/useSideBarParams";
import { UNREAD_NOTIFICATION_ATOM } from "@/state/atoms/notification";
import {
  ORGANIZATIONS_LIST_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import { fireEvent, render, screen } from "@testing-library/react";
import { useAtom } from "jotai";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLocation } from "wouter";
import { SideBar } from "./index";

// Mock all required hooks and modules
vi.mock("jotai", async () => {
  const actual = await vi.importActual("jotai");
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});

vi.mock("wouter", () => ({
  useLocation: vi.fn(),
  useParams: vi.fn(),
}));

vi.mock("@/hooks/navigate", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("@/hooks/useGetUnreadNotifications", () => ({
  useGetUnreadNotifications: vi.fn(),
}));

vi.mock("@/hooks/usePostReadNotifications", () => ({
  usePostReadNotifications: vi.fn(),
}));

vi.mock("@/hooks/useOrgPermissions", () => ({
  useOrgPermissions: vi.fn(),
}));

vi.mock("@/hooks/useProjectPermissions", () => ({
  useProjectPermissions: vi.fn(),
}));

vi.mock("@/hooks/useSideBarParams", () => ({
  useSideBarParams: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("SideBar Component", () => {
  const mockNavigate = vi.fn();
  const mockMutate = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementations
    (useNavigate as any).mockReturnValue(mockNavigate);
    (useLocation as any).mockReturnValue(["/dashboard"]);
    (useAtom as any).mockImplementation((atom: unknown) => {
      if (atom === UNREAD_NOTIFICATION_ATOM) return [false];
      if (atom === PROJECT_LIST_ATOM) return [[]];
      if (atom === ORGANIZATIONS_LIST_ATOM) return [[]];
      return [null];
    });
    (useGetUnreadNotifications as any).mockReturnValue(undefined);
    (usePostReadNotifications as any).mockReturnValue({ mutate: mockMutate });
    (useOrgPermissions as any).mockReturnValue({
      organizations: true,
      projects: true,
      organizationMembers: true,
      role: true,
    });
    (useProjectPermissions as any).mockReturnValue({
      projects: true,
      member: true,
      role: true,
    });
    (useSideBarParams as any).mockReturnValue(["", ""]);
  });

  it("renders without crashing", () => {
    render(<SideBar />);
    expect(screen.getByTestId("sidebar-id")).toBeInTheDocument();
  });

  it("renders dashboard menu when path starts with /dashboard", () => {
    (useLocation as any).mockReturnValue(["/dashboard"]);
    (useOrgPermissions as any).mockReturnValue({
      apiKeys: true,
    });
    render(<SideBar />);
    expect(screen.getByText("api keys")).toBeInTheDocument();
    expect(screen.getByText("usage")).toBeInTheDocument();
    expect(screen.getByText("dll")).toBeInTheDocument();
  });

  it("renders profile menu when path starts with /profile", () => {
    (useLocation as any).mockReturnValue(["/profile"]);
    render(<SideBar />);
    expect(screen.getByText("general")).toBeInTheDocument();
    expect(screen.getByText("notifications")).toBeInTheDocument();
  });

  it("calls onClose when menu item is clicked", () => {
    (useLocation as any).mockReturnValue(["/dashboard"]);
    (useOrgPermissions as any).mockReturnValue({
      apiKeys: true,
    });

    render(<SideBar onClose={mockOnClose} />);
    fireEvent.click(screen.getByText("api keys"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls mutate when notifications menu item is clicked", () => {
    (useLocation as any).mockReturnValue(["/profile"]);
    render(<SideBar />);
    fireEvent.click(screen.getByText("notifications"));
    expect(mockMutate).toHaveBeenCalled();
  });

  it("renders social media links", () => {
    render(<SideBar />);
    expect(screen.getByTestId("sidebar-id")).toBeInTheDocument();
    // Add more specific assertions based on your socialMediaList implementation
  });

  it("handles empty organization list", () => {
    (useAtom as any).mockImplementation((atom: unknown) => {
      if (atom === ORGANIZATIONS_LIST_ATOM) return [[]];
      return [null];
    });
    render(<SideBar />);
    expect(screen.getByTestId("sidebar-id")).toBeInTheDocument();
  });

  it("handles empty project list", () => {
    (useAtom as any).mockImplementation((atom: unknown) => {
      if (atom === PROJECT_LIST_ATOM) return [[]];
      return [null];
    });
    render(<SideBar />);
    expect(screen.getByTestId("sidebar-id")).toBeInTheDocument();
  });

  it("handles unread notifications", () => {
    (useAtom as any).mockImplementation((atom: unknown) => {
      if (atom === UNREAD_NOTIFICATION_ATOM) return [true];
      return [null];
    });
    render(<SideBar />);
    expect(screen.getByTestId("sidebar-id")).toBeInTheDocument();
  });

  it("handles user permissions", () => {
    (useOrgPermissions as any).mockReturnValue({
      organizations: false,
      projects: false,
      organizationMembers: false,
      role: false,
    });
    render(<SideBar />);
    expect(screen.getByTestId("sidebar-id")).toBeInTheDocument();
  });

  it("handles project permissions", () => {
    (useProjectPermissions as any).mockReturnValue({
      projects: false,
      member: false,
      role: false,
    });
    render(<SideBar />);
    expect(screen.getByTestId("sidebar-id")).toBeInTheDocument();
  });
});
