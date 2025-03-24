import Header from "@/components/Header";
import { useNavigate } from "@/hooks/navigate";
import { PROJECT_LIST_ATOM } from "@/state/atoms/organisation";
import { fireEvent, render, screen } from "@testing-library/react";
import { useAtom } from "jotai";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLocation } from "wouter";

vi.mock("jotai", async () => {
  const actual = await vi.importActual("jotai");
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});

vi.mock("@/hooks/navigate", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("wouter", () => ({
  useLocation: vi.fn(),
}));

vi.mock("@/components/ProfileAvatar", () => ({
  __esModule: true,
  default: () => <div data-testid="profile-avatar">ProfileAvatar</div>,
}));

vi.mock("@/components/SheetSideBar", () => ({
  __esModule: true,
  SheetSideBar: () => <div data-testid="sheet-sidebar">SheetSideBar</div>,
}));

vi.mock("@/components/OriganisactionHeader", () => ({
  __esModule: true,
  default: ({ className }: { className: string }) => (
    <div data-testid="organization-header" className={className}>
      OrganizationHeader
    </div>
  ),
}));

vi.mock("@/assets/notication.svg?react", () => ({
  __esModule: true,
  default: () => <div data-testid="notification-icon">Notification</div>,
}));

vi.mock("@/assets/notification_empty.svg?react", () => ({
  __esModule: true,
  default: ({ className }: { className: string }) => (
    <div data-testid="notification-empty-icon" className={className}>
      NotificationEmpty
    </div>
  ),
}));

describe("Header Component", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock navigate
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    // Mock Location and Pathname
    vi.mocked(useLocation).mockReturnValue(["/dashboard", vi.fn()]);

    // Mock jotai atoms
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === PROJECT_LIST_ATOM) {
        return [[{ id: "project-1" }]] as any; // Mock a non-empty project list
      }
      return [null];
    });
  });

  it("should render the header and show organization header and sidebar", () => {
    render(<Header />);
    // Organization Header and Sidebar should render correctly
    const headers = screen.getAllByTestId("organization-header");
    expect(headers[0]).toHaveClass("hidden lg:flex"); // 验证类名

    // 验证 Sidebar 存在
    expect(screen.getByTestId("sheet-sidebar")).toBeInTheDocument();
  });

  it("should not render header on ignored paths", () => {
    vi.mocked(useLocation).mockReturnValue(["/login", vi.fn()]);

    render(<Header />);

    // Ensure header is hidden
    expect(screen.queryByTestId("header-wrapper")).toHaveClass("hidden");
  });

  it("should disable dashboard button if project list is empty", () => {
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === PROJECT_LIST_ATOM) {
        return [[]] as any; // Mock an empty project list
      }
      return [null];
    });

    render(<Header />);

    const dashboardButton = screen.getByText("dashboard");
    expect(dashboardButton).toHaveClass("cursor-not-allowed text-[#606060]");

    // Simulate click
    fireEvent.click(dashboardButton);
    expect(mockNavigate).not.toHaveBeenCalled(); // Navigation should not happen
  });

  it("should navigate to dashboard on button click", () => {
    render(<Header />);

    const dashboardButton = screen.getByText("dashboard");
    fireEvent.click(dashboardButton);

    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("should navigate to settings on button click", () => {
    render(<Header />);

    const settingsButton = screen.getByText("settings");
    fireEvent.click(settingsButton);

    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  it("should show notification when isNotication is true", () => {
    render(<Header />);

    // Show Notification icon
    expect(screen.getByTestId("notification-icon")).toBeInTheDocument();
    expect(
      screen.queryByTestId("notification-empty-icon"),
    ).not.toBeInTheDocument();
  });
});
