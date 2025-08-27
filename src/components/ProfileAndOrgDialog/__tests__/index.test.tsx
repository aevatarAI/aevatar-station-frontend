import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "jotai";
import { describe, expect, it, vi } from "vitest";
import ProfileAndOrgDialog from "../index";

// Mock the child components
vi.mock("@/components/ProfileInner", () => ({
  default: ({ tab }: { tab: string }) => (
    <div data-testid="profile-inner">Profile Inner - Tab: {tab}</div>
  ),
}));

vi.mock("@/components/OrganisationInner", () => ({
  default: ({ tab }: { tab: string }) => (
    <div data-testid="organisation-inner">Organisation Inner - Tab: {tab}</div>
  ),
}));

// Mock the dialog components
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open, onOpenChange }: any) => (
    <div data-testid="dialog" data-open={open}>
      {children}
    </div>
  ),
  DialogContent: ({ children, className }: any) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  ),
  DialogTrigger: ({ children }: any) => (
    <div data-testid="dialog-trigger">{children}</div>
  ),
}));

// Mock the sidebar components
vi.mock("@/components/ui/sidebar", () => ({
  SidebarContent: ({ children, className }: any) => (
    <div data-testid="sidebar-content" className={className}>
      {children}
    </div>
  ),
  SidebarGroup: ({ children }: any) => (
    <div data-testid="sidebar-group">{children}</div>
  ),
  SidebarGroupLabel: ({ children }: any) => (
    <div data-testid="sidebar-group-label">{children}</div>
  ),
  SidebarGroupContent: ({ children }: any) => (
    <div data-testid="sidebar-group-content">{children}</div>
  ),
  SidebarMenu: ({ children }: any) => (
    <ul data-testid="sidebar-menu">{children}</ul>
  ),
  SidebarMenuItem: ({ children }: any) => (
    <li data-testid="sidebar-menu-item">{children}</li>
  ),
  SidebarMenuButton: ({ children, isActive, onClick }: any) => (
    // biome-ignore lint/a11y/useButtonType: <explanation>
    <button
      data-testid="sidebar-menu-button"
      data-active={isActive}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  User: () => <span data-testid="user-icon">User</span>,
  Bell: () => <span data-testid="bell-icon">Bell</span>,
  Building2: () => <span data-testid="building-icon">Building</span>,
  FolderOpen: () => <span data-testid="folder-icon">Folder</span>,
  Users: () => <span data-testid="users-icon">Users</span>,
  Shield: () => <span data-testid="shield-icon">Shield</span>,
  ChevronRight: () => <span data-testid="chevron-icon">Chevron</span>,
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<Provider>{component}</Provider>);
};

describe("ProfileAndOrgDialog", () => {
  it("renders dialog trigger", () => {
    renderWithProvider(<ProfileAndOrgDialog />);
    expect(screen.getByTestId("dialog-trigger")).toBeInTheDocument();
  });

  it("renders sidebar with profile and organisation sections", () => {
    renderWithProvider(<ProfileAndOrgDialog />);

    expect(screen.getByTestId("sidebar-content")).toBeInTheDocument();
    expect(screen.getAllByTestId("sidebar-group")).toHaveLength(2);
    expect(screen.getAllByTestId("sidebar-group-label")).toHaveLength(2);
  });

  it("renders profile section with general and notifications tabs", () => {
    renderWithProvider(<ProfileAndOrgDialog />);

    // Check for the specific text content in the profile section
    const profileLabels = screen.getAllByText(/General|Notifications/);
    expect(profileLabels.length).toBeGreaterThanOrEqual(2);
  });

  it("renders organisation section with general, projects, members, and roles tabs", () => {
    renderWithProvider(<ProfileAndOrgDialog />);

    // Check for the specific text content in the organisation section
    const orgLabels = screen.getAllByText(/General|Projects|Members|Roles/);
    expect(orgLabels.length).toBeGreaterThanOrEqual(4);
  });

  it("renders all required icons", () => {
    renderWithProvider(<ProfileAndOrgDialog />);

    expect(screen.getByTestId("user-icon")).toBeInTheDocument();
    expect(screen.getByTestId("bell-icon")).toBeInTheDocument();
    expect(screen.getByTestId("building-icon")).toBeInTheDocument();
    expect(screen.getByTestId("folder-icon")).toBeInTheDocument();
    expect(screen.getByTestId("users-icon")).toBeInTheDocument();
    expect(screen.getByTestId("shield-icon")).toBeInTheDocument();
    expect(screen.getByTestId("chevron-icon")).toBeInTheDocument();
  });

  it("has correct dialog dimensions and styling", () => {
    renderWithProvider(<ProfileAndOrgDialog />);

    const dialogContent = screen.getByTestId("dialog-content");
    expect(dialogContent).toHaveClass("w-[960px]", "h-[480px]", "p-0");
  });

  it("has correct sidebar width", () => {
    renderWithProvider(<ProfileAndOrgDialog />);

    // Find the sidebar container div that has the width class
    const sidebarContainer =
      screen.getByTestId("sidebar-content").parentElement;
    expect(sidebarContainer).toHaveClass("w-[224px]");
  });

  it("renders breadcrumb navigation", () => {
    renderWithProvider(<ProfileAndOrgDialog />);

    // Check if breadcrumb elements are present
    const breadcrumbContainer = screen.getByText("profile").closest("div");
    expect(breadcrumbContainer).toHaveClass("flex", "items-center", "gap-2");
  });

  it("renders correct number of sidebar menu items", () => {
    renderWithProvider(<ProfileAndOrgDialog />);

    // Should have 2 profile items + 4 organisation items = 6 total
    expect(screen.getAllByTestId("sidebar-menu-item")).toHaveLength(6);
  });

  it("renders profile and organisation group labels", () => {
    renderWithProvider(<ProfileAndOrgDialog />);

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Organisation")).toBeInTheDocument();
  });

  it("renders all sidebar menu buttons", () => {
    renderWithProvider(<ProfileAndOrgDialog />);

    // Should have 6 menu buttons total
    expect(screen.getAllByTestId("sidebar-menu-button")).toHaveLength(6);
  });
});
