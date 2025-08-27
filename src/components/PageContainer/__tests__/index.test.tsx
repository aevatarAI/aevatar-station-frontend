import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PageSideBar from "../index";

// Mock the hooks and components
vi.mock("@/hooks/useSideBarParams", () => ({
  useSideBarParams: () => ["workflows", vi.fn()],
}));

vi.mock("@/hooks/navigate", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("@/hooks/useOrgPermissions", () => ({
  useOrgPermissions: () => ({
    apiKeys: true,
    dashboards: true,
  }),
}));

vi.mock("@/hooks/useProjectPermissions", () => ({
  useProjectPermissions: () => ({
    apiKeys: true,
    plugins: true,
    corsOrigins: true,
  }),
}));

// Mock the organization atoms with proper data structure
vi.mock("@/state/atoms/organisation", () => ({
  CURRENT_ORGANIZATION_ATOM: "current-org",
  ORGANIZATIONS_LIST_ATOM: "org-list",
}));

vi.mock("jotai", () => ({
  useAtom: (atom: string) => {
    if (atom === "current-org") {
      return ["test-org-id", vi.fn()];
    }
    if (atom === "org-list") {
      return [
        [
          {
            id: "test-org-id",
            displayName: "Test Organization",
          },
          {
            id: "other-org-id",
            displayName: "Other Organization",
          },
        ],
        vi.fn(),
      ];
    }
    return [undefined, vi.fn()];
  },
}));

vi.mock("@/components/PageContainer/PageHeader", () => ({
  default: () => <div data-testid="page-header">Page Header</div>,
}));

vi.mock("@/assets/org-icon.svg?react", () => ({
  default: () => <div data-testid="org-icon">Org Icon</div>,
}));

vi.mock("@/assets/chevrons-up-down.svg?react", () => ({
  default: () => <div data-testid="step-select">Step Select</div>,
}));

vi.mock("@/assets/api_keys.svg?react", () => ({
  default: () => <div data-testid="api-keys-icon">API Keys Icon</div>,
}));

vi.mock("@/assets/dll_menu.svg?react", () => ({
  default: () => <div data-testid="dll-icon">DLL Icon</div>,
}));

vi.mock("@/assets/workflow.svg?react", () => ({
  default: () => <div data-testid="workflow-icon">Workflow Icon</div>,
}));

vi.mock("@/assets/cog.svg?react", () => ({
  default: () => <div data-testid="settings-icon">Settings Icon</div>,
}));

vi.mock("@/assets/member.svg?react", () => ({
  default: () => <div data-testid="member-icon">Member Icon</div>,
}));

vi.mock("@/assets/role.svg?react", () => ({
  default: () => <div data-testid="role-icon">Role Icon</div>,
}));

vi.mock("@/constants/socialMedia", () => ({
  socialMediaList: [
    {
      title: "GitHub",
      href: "https://github.com",
      icon: <div data-testid="github-icon">GitHub</div>,
    },
  ],
}));

vi.mock("@/constants/cls", () => ({
  itemClassName: "item-class",
  itemHoverClassName: "item-hover-class",
  itemSelectClassName: "item-select-class",
}));

// Mock the sidebar components
vi.mock("@/components/ui/sidebar", () => ({
  Sidebar: ({ children, ...props }: any) => (
    <div data-testid="sidebar" {...props}>
      {children}
    </div>
  ),
  SidebarContent: ({ children, ...props }: any) => (
    <div data-testid="sidebar-content" {...props}>
      {children}
    </div>
  ),
  SidebarFooter: ({ children, ...props }: any) => (
    <div data-testid="sidebar-footer" {...props}>
      {children}
    </div>
  ),
  SidebarGroup: ({ children, ...props }: any) => (
    <div data-testid="sidebar-group" {...props}>
      {children}
    </div>
  ),
  SidebarGroupContent: ({ children, ...props }: any) => (
    <div data-testid="sidebar-group-content" {...props}>
      {children}
    </div>
  ),
  SidebarGroupLabel: ({ children, ...props }: any) => (
    <div data-testid="sidebar-group-label" {...props}>
      {children}
    </div>
  ),
  SidebarHeader: ({ children, ...props }: any) => (
    <div data-testid="sidebar-header" {...props}>
      {children}
    </div>
  ),
  SidebarInset: ({ children, ...props }: any) => (
    <div data-testid="sidebar-inset" {...props}>
      {children}
    </div>
  ),
  SidebarMenu: ({ children, ...props }: any) => (
    <ul data-testid="sidebar-menu" {...props}>
      {children}
    </ul>
  ),
  SidebarMenuButton: ({ children, ...props }: any) => (
    <button data-testid="sidebar-menu-button" {...props}>
      {children}
    </button>
  ),
  SidebarMenuItem: ({ children, ...props }: any) => (
    <li data-testid="sidebar-menu-item" {...props}>
      {children}
    </li>
  ),
  SidebarMenuSub: ({ children, ...props }: any) => (
    <ul data-testid="sidebar-menu-sub" {...props}>
      {children}
    </ul>
  ),
  SidebarMenuSubButton: ({ children, ...props }: any) => (
    <button data-testid="sidebar-menu-sub-button" {...props}>
      {children}
    </button>
  ),
  SidebarMenuSubItem: ({ children, ...props }: any) => (
    <li data-testid="sidebar-menu-sub-item" {...props}>
      {children}
    </li>
  ),
  SidebarProvider: ({ children, ...props }: any) => (
    <div data-testid="sidebar-provider" {...props}>
      {children}
    </div>
  ),
  SidebarRail: ({ ...props }: any) => (
    <div data-testid="sidebar-rail" {...props} />
  ),
  SidebarSeparator: ({ ...props }: any) => (
    <div data-testid="sidebar-separator" {...props} />
  ),
  SidebarTrigger: ({ ...props }: any) => (
    <button data-testid="sidebar-trigger" {...props} />
  ),
  useSidebar: () => ({
    open: true,
    state: "expanded",
    setOpen: vi.fn(),
    isMobile: false,
    openMobile: false,
    setOpenMobile: vi.fn(),
    toggleSidebar: vi.fn(),
  }),
}));

// Mock the popover components
vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children, ...props }: any) => (
    <div data-testid="popover" {...props}>
      {children}
    </div>
  ),
  PopoverContent: ({ children, ...props }: any) => (
    <div data-testid="popover-content" {...props}>
      {children}
    </div>
  ),
  PopoverTrigger: ({ children, ...props }: any) => (
    <button data-testid="popover-trigger" {...props}>
      {children}
    </button>
  ),
}));

describe("PageSideBar Component", () => {
  it("should render without crashing", () => {
    render(<PageSideBar>Test Content</PageSideBar>);

    expect(screen.getByTestId("sidebar-provider")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-inset")).toBeInTheDocument();
  });

  it("should render sidebar header with organization switcher", () => {
    render(<PageSideBar>Test Content</PageSideBar>);

    expect(screen.getByTestId("sidebar-header")).toBeInTheDocument();
    expect(screen.getByTestId("org-icon")).toBeInTheDocument();
  });

  it("should render sidebar content with navigation sections", () => {
    render(<PageSideBar>Test Content</PageSideBar>);

    expect(screen.getByTestId("sidebar-content")).toBeInTheDocument();

    // Check for navigation sections
    const groups = screen.getAllByTestId("sidebar-group");
    expect(groups.length).toBeGreaterThan(0);
  });

  it("should render workspace navigation section", () => {
    render(<PageSideBar>Test Content</PageSideBar>);

    const groupLabels = screen.getAllByTestId("sidebar-group-label");
    const workspaceLabel = groupLabels.find(
      (label) => label.textContent === "Workspace",
    );
    expect(workspaceLabel).toBeInTheDocument();
  });

  it("should render settings navigation section", () => {
    render(<PageSideBar>Test Content</PageSideBar>);

    const groupLabels = screen.getAllByTestId("sidebar-group-label");
    const settingsLabel = groupLabels.find(
      (label) => label.textContent === "Settings",
    );
    expect(settingsLabel).toBeInTheDocument();
  });

  it("should render resources navigation section", () => {
    render(<PageSideBar>Test Content</PageSideBar>);

    const groupLabels = screen.getAllByTestId("sidebar-group-label");
    const resourcesLabel = groupLabels.find(
      (label) => label.textContent === "Resources",
    );
    expect(resourcesLabel).toBeInTheDocument();
  });

  it("should render sidebar footer and rail", () => {
    render(<PageSideBar>Test Content</PageSideBar>);

    expect(screen.getByTestId("sidebar-footer")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-rail")).toBeInTheDocument();
  });

  it("should render sidebar inset with header and content", () => {
    render(<PageSideBar>Test Content</PageSideBar>);

    expect(screen.getByTestId("sidebar-inset")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("page-header")).toBeInTheDocument();
  });

  it("should render children content in sidebar inset", () => {
    render(<PageSideBar>Test Content</PageSideBar>);

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should render separators between navigation sections", () => {
    render(<PageSideBar>Test Content</PageSideBar>);

    const separators = screen.getAllByTestId("sidebar-separator");
    expect(separators.length).toBeGreaterThan(0);
  });

  it("should render navigation menu items", () => {
    render(<PageSideBar>Test Content</PageSideBar>);

    const menuItems = screen.getAllByTestId("sidebar-menu-item");
    expect(menuItems.length).toBeGreaterThan(0);
  });

  it("should render navigation menu buttons", () => {
    render(<PageSideBar>Test Content</PageSideBar>);

    const menuButtons = screen.getAllByTestId("sidebar-menu-button");
    expect(menuButtons.length).toBeGreaterThan(0);
  });

  it("should render sub-menu structure for settings", () => {
    render(<PageSideBar>Test Content</PageSideBar>);

    const subMenus = screen.getAllByTestId("sidebar-menu-sub");
    expect(subMenus.length).toBeGreaterThan(0);
  });

  it("should render social media resources", () => {
    render(<PageSideBar>Test Content</PageSideBar>);

    expect(screen.getByTestId("github-icon")).toBeInTheDocument();
  });

  it("should have proper sidebar structure", () => {
    render(<PageSideBar>Test Content</PageSideBar>);

    // Check the overall structure
    const sidebar = screen.getByTestId("sidebar");
    const header = screen.getByTestId("sidebar-header");
    const content = screen.getByTestId("sidebar-content");
    const footer = screen.getByTestId("sidebar-footer");
    const rail = screen.getByTestId("sidebar-rail");

    expect(sidebar).toContainElement(header);
    expect(sidebar).toContainElement(content);
    expect(sidebar).toContainElement(footer);
    expect(sidebar).toContainElement(rail);
  });

  it("should have proper inset structure", () => {
    render(<PageSideBar>Test Content</PageSideBar>);

    const inset = screen.getByTestId("sidebar-inset");
    const trigger = screen.getByTestId("sidebar-trigger");
    const header = screen.getByTestId("page-header");

    expect(inset).toContainElement(trigger);
    expect(inset).toContainElement(header);
  });
});
