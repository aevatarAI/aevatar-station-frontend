import Header from "@/components/Header";
import { useNavigate } from "@/hooks/navigate";
import { usePostReadNotifications } from "@/hooks/usePostReadNotifications";
import { UNREAD_NOTIFICATION_ATOM } from "@/state/atoms/notification";
import { PROJECT_LIST_ATOM } from "@/state/atoms/organisation";
import { fireEvent, render, screen } from "@testing-library/react";
import { useAtom } from "jotai";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLocation } from "wouter";

// Mock all dependencies
vi.mock("jotai", async () => {
  const actual = await vi.importActual("jotai");
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});

vi.mock("@/hooks/navigate", () => ({
  useNavigate: vi.fn(() => mockNavigate),
}));

vi.mock("wouter", () => ({
  useLocation: vi.fn(() => ["/dashboard", vi.fn()]),
}));

vi.mock("@/hooks/usePostReadNotifications", () => ({
  usePostReadNotifications: vi.fn(() => ({
    mutate: mockMutate,
  })),
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
  default: () => <div data-testid="notification-icon">NotificationIcon</div>,
}));

vi.mock("@/assets/notification_empty.svg?react", () => ({
  __esModule: true,
  default: ({ className }: { className?: string }) => (
    <div data-testid="notification-empty-icon" className={className}>
      NotificationEmptyIcon
    </div>
  ),
}));

vi.mock("@/assets/aevatar_ai_logo.svg", () => ({
  default: "mocked-logo-path",
}));

describe("Header Component", () => {
  const mockNavigate = vi.fn();
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock navigate
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    // Mock Location and Pathname
    vi.mocked(useLocation).mockReturnValue(["/dashboard", vi.fn()]);

    // Mock notification mutate
    vi.mocked(usePostReadNotifications).mockReturnValue({
      mutate: mockMutate,
    } as any);

    // Mock jotai atoms
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === PROJECT_LIST_ATOM) {
        return [[]] as any;
      }
      if (atom === UNREAD_NOTIFICATION_ATOM) {
        return [0] as any;
      }
      if (
        (typeof atom === "object" &&
          atom !== null &&
          "key" in atom &&
          typeof atom.key === "string" &&
          atom.key.includes("ORGANIZATION_PERMISSION_ATOM")) ||
        (typeof atom === "string" &&
          atom.includes("ORGANIZATION_PERMISSION_ATOM"))
      ) {
        return [[]] as any;
      }
      return [null];
    });
  });

  describe("Rendering Tests", () => {
    it("should render the header with organization header and sidebar on dashboard", () => {
      render(<Header />);
      const headers = screen.getAllByTestId("organization-header");
      expect(headers[0]).toHaveClass("hidden lg:flex");
      expect(screen.getByTestId("sheet-sidebar")).toBeInTheDocument();
    });

    it("should render aevatar logo on welcome page", () => {
      vi.mocked(useLocation).mockReturnValue(["/welcome", vi.fn()]);
      render(<Header />);
      const logo = screen.getByAltText("aevatarAi");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", "mocked-logo-path");
    });

    it("should not render header on ignored paths", () => {
      const ignoredPaths = ["/", "/login", "/register", "/verification"];

      ignoredPaths.forEach((path) => {
        vi.mocked(useLocation).mockReturnValue([path, vi.fn()]);
        const { rerender } = render(<Header />);
        expect(screen.getByTestId("header-wrapper")).toHaveClass("hidden");
        // biome-ignore lint/complexity/noUselessFragments: <explanation>
        rerender(<></>);
      });
    });

    it("should render responsive layout correctly", () => {
      vi.mocked(useLocation).mockReturnValue(["/dashboard", vi.fn()]);
      render(<Header />);

      // Desktop view
      const desktopHeader = screen.getAllByTestId("organization-header")[0];
      expect(desktopHeader).toHaveClass("hidden lg:flex");

      // Mobile view
      const mobileHeader = screen.getAllByTestId("organization-header")[1];
      expect(mobileHeader).toHaveClass("justify-start px-[20px]");
    });

    it("should render notification button", () => {
      render(<Header />);
      expect(screen.getByTestId("notification-empty-icon")).toBeInTheDocument();
    });

    it("should display notification icon when unread count is greater than 0", () => {
      vi.mocked(useAtom).mockImplementation((atom) => {
        if (atom === PROJECT_LIST_ATOM) {
          return [[]] as any;
        }
        if (atom === UNREAD_NOTIFICATION_ATOM) {
          return [2] as any;
        }
        return [null];
      });

      render(<Header />);
      expect(screen.getByTestId("notification-icon")).toBeInTheDocument();
    });
  });

  describe("Navigation Tests", () => {
    it("should disable dashboard button if project list is empty", () => {
      render(<Header />);
      const dashboardButton = screen.getByText("dashboard");
      expect(dashboardButton).toHaveClass("cursor-not-allowed");
      // 检查是否包含禁用状态
      expect(dashboardButton).toBeInTheDocument();

      fireEvent.click(dashboardButton);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should navigate to settings on button click", () => {
      render(<Header />);
      const settingsButton = screen.getByText("settings");
      fireEvent.click(settingsButton);
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });

    it("should handle notification button click correctly", () => {
      render(<Header />);
      const notificationButton = screen.getByRole("button", {
        name: /notification/i,
      });

      fireEvent.click(notificationButton);
      expect(mockMutate).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(
        "/profile/profile/notifications",
      );
    });
  });

  describe("Notification State Tests", () => {
    it("should show notification icon when there are unread notifications", () => {
      vi.mocked(useAtom).mockImplementation((atom) => {
        if (atom === UNREAD_NOTIFICATION_ATOM) {
          return [true] as any;
        }
        return [[{ id: "project-1" }]];
      });

      render(<Header />);
      expect(screen.getByTestId("notification-icon")).toBeInTheDocument();
      expect(
        screen.queryByTestId("notification-empty-icon"),
      ).not.toBeInTheDocument();
    });

    it("should show empty notification icon when there are no unread notifications", () => {
      vi.mocked(useAtom).mockImplementation((atom) => {
        if (atom === UNREAD_NOTIFICATION_ATOM) {
          return [false] as any;
        }
        return [[{ id: "project-1" }]];
      });

      render(<Header />);
      expect(screen.queryByTestId("notification-icon")).not.toBeInTheDocument();
      expect(screen.getByTestId("notification-empty-icon")).toBeInTheDocument();
    });

    it("should not show unread count when 0", () => {
      vi.mocked(useAtom).mockImplementation((atom) => {
        if (atom === UNREAD_NOTIFICATION_ATOM) {
          return [false] as any;
        }
        return [[{ id: "project-1" }]];
      });

      render(<Header />);
      expect(screen.queryByText("0")).not.toBeInTheDocument();
    });
  });

  describe("Responsive Layout Tests", () => {
    it("should render mobile layout for small screens", () => {
      global.innerWidth = 500;
      global.dispatchEvent(new Event("resize"));
      render(<Header />);
      // Add mobile-specific layout checks here
    });

    it("should render desktop layout for large screens", () => {
      global.innerWidth = 1200;
      global.dispatchEvent(new Event("resize"));
      render(<Header />);
      // Add desktop-specific layout checks here
    });
  });
});
