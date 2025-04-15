import { SideBar } from "@/components/SideBar";
import { socialMediaList } from "@/constants/socialMedia";
import { useNavigate } from "@/hooks/navigate";
import {
  ORGANIZATIONS_LIST_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import { fireEvent, render, screen } from "@testing-library/react";
import { useAtom } from "jotai";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLocation, useParams } from "wouter";

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

vi.mock("@/hooks/useOrgPermissions", () => ({
  useOrgPermissions: vi.fn(() => ({
    organizations: true,
    organizationsEdit: true,
    organizationMembers: true,
  })),
}));

vi.mock("@/hooks/useProjectPermissions", () => ({
  useProjectPermissions: vi.fn(() => ({
    projects: true,
    projectsEdit: true,
    projectsMembersManage: true,
  })),
}));

// Mock通知图标
vi.mock("@/assets/notication.svg?react", () => ({
  __esModule: true,
  default: () => <div data-testid="notification-icon">Notification</div>,
}));

vi.mock("@/assets/notification_empty.svg?react", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="notification-empty-icon">NotificationEmpty</div>
  ),
}));

describe("SideBar Component", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock 各种 hooks 和状态
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    vi.mocked(useLocation).mockReturnValue(["/profile", vi.fn()]);
    vi.mocked(useParams).mockReturnValue({ menu: "profile", tab: "general" });

    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === PROJECT_LIST_ATOM) {
        return [[{ id: "project-1" }]] as any;
      }
      if (atom === ORGANIZATIONS_LIST_ATOM) {
        return [[{ id: "organization-1" }]];
      }
      return [null];
    });
  });

  it("should render the sidebar with profile menu items", () => {
    render(<SideBar />);

    expect(screen.getByTestId("sidebar-id")).toBeInTheDocument();
  });

  it("should render the dashboard menu when pathname is /dashboard", () => {
    vi.mocked(useLocation).mockReturnValue(["/dashboard", vi.fn()]);

    render(<SideBar />);

    // 验证 Dashboard 菜单是否存在
    const dashboardMenuItem = screen.getByText("api keys");
    expect(dashboardMenuItem).toBeInTheDocument();

    // 点击触发导航行为
    fireEvent.click(dashboardMenuItem);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/apikeys");
  });

  it("should show notification empty icon when NOTIFICATION_ATOM is true", () => {
    render(<SideBar />);
    // 验证 NotificationEmpty 图标被正确渲染
    expect(screen.getByTestId("notification-empty-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("notification-icon")).not.toBeInTheDocument();
  });

  //   it("should navigate to profile menu on click", () => {
  //     render(<SideBar />);

  //     // 点击 Profile 中的 "general"
  //     const generalMenuItem = screen.getAllByAltText("general");
  //     fireEvent.click(generalMenuItem[0]);

  //     // 验证导航行为
  //     expect(mockNavigate).toHaveBeenCalledWith("/profile/profile/general");

  //     // 点击 "notifications"
  //     const notificationsMenuItem = screen.getByText("notifications");
  //     fireEvent.click(notificationsMenuItem);

  //     // 验证导航行为
  //     expect(mockNavigate).toHaveBeenCalledWith("/profile/profile/notifications");
  //   });

  //   it("should render organisation and project menu items based on permissions", () => {
  //     render(<SideBar />);

  //     // 验证 Organisation 菜单项
  //     expect(screen.getByText("general")).toBeInTheDocument();
  //     expect(screen.getByText("project")).toBeInTheDocument();
  //     expect(screen.getByText("member")).toBeInTheDocument();

  //     // 验证 Project 菜单项
  //     expect(screen.getByText("general")).toBeInTheDocument();
  //     expect(screen.getByText("member")).toBeInTheDocument();
  //   });

  //   it("should not render organisation menu if user has no permissions", () => {
  //     vi.mocked(useParams).mockReturnValue({ menu: "organisation" });
  //     vi.mocked(useOrgPermissions).mockReturnValue({
  //       organizations: false,
  //       organizationsEdit: false,
  //       organizationMembers: false,
  //     });

  //     render(<SideBar />);

  //     // 所有 Organisation 菜单项应该不存在
  //     expect(screen.queryByText("general")).not.toBeInTheDocument();
  //     expect(screen.queryByText("project")).not.toBeInTheDocument();
  //     expect(screen.queryByText("member")).not.toBeInTheDocument();
  //   });

  //   it("should render social media links correctly", () => {
  //     render(<SideBar />);

  //     // 验证社交媒体链接存在
  //     const socialLinks = screen.getAllByRole("link");
  //     expect(socialLinks.length).toBe(socialMediaList.length);

  //     // 验证第一个社交媒体链接属性
  //     expect(socialLinks[0]).toHaveTextContent(socialMediaList[0].title);
  //     expect(socialLinks[0]).toHaveAttribute("href", socialMediaList[0].href);
  //   });

  //   it("should set notificationClicked to true when notifications menu clicked", () => {
  //     const mockSetNotificationClicked = vi.fn();
  //     vi.mocked(useAtom).mockImplementation((atom) => {
  //       if (atom === NOTIFICATION_ATOM) {
  //         return [false, mockSetNotificationClicked] as any;
  //       }
  //       return [null];
  //     });

  //     render(<SideBar />);

  //     // 点击 "notifications" 菜单
  //     const notificationsMenuItem = screen.getByText("notifications");
  //     fireEvent.click(notificationsMenuItem);

  //     // 验证通知点击状态更新
  //     expect(mockSetNotificationClicked).toHaveBeenCalledWith(true);
  //   });
});
