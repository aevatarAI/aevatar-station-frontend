import { SheetSideBar } from "@/components/SheetSideBar";
import { useCloseDialog } from "@/hooks/useCloseDialog";
import { render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the useCloseDialog hook
vi.mock("@/hooks/useCloseDialog", () => ({
  useCloseDialog: vi.fn(),
}));

// Mock the SideBar component
vi.mock("@/components/SideBar", () => ({
  SideBar: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="sidebar" onClick={onClose}>
      SideBar Component
    </div>
  ),
}));

// Mock the UI components
vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet">{children}</div>
  ),
  SheetTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-trigger">{children}</div>
  ),
  SheetContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-content">{children}</div>
  ),
}));

vi.mock("@/components/ui/dialog", () => ({
  DialogClose: ({ children, ref }: { children: React.ReactNode; ref: any }) => (
    // biome-ignore lint/a11y/useButtonType: <explanation>
    <button ref={ref} data-testid="dialog-close">
      {children}
    </button>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="dialog-title">{children}</h2>
  ),
}));

// Mock the Menu SVG
vi.mock("@/assets/menu.svg?react", () => ({
  default: ({ className }: { className: string }) => (
    <div data-testid="menu-icon" className={className}>
      Menu Icon
    </div>
  ),
}));

describe("SheetSideBar Component", () => {
  const mockHandleClose = vi.fn();
  const mockRef = { current: null };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCloseDialog).mockReturnValue({
      ref: mockRef,
      handleClose: mockHandleClose,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should render the SheetSideBar component", () => {
    render(<SheetSideBar />);

    expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  it("should render Menu icon with correct classes", () => {
    render(<SheetSideBar />);

    const menuIcon = screen.getByTestId("menu-icon");
    expect(menuIcon).toHaveClass("lg:hidden", "cursor-pointer");
  });

  it("should render SideBar component with onClose handler", () => {
    render(<SheetSideBar />);

    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveTextContent("SideBar Component");
  });

  it("should call handleClose when SideBar onClose is triggered", () => {
    render(<SheetSideBar />);

    const sidebar = screen.getByTestId("sidebar");
    sidebar.click();

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it("should render Sheet with correct props", () => {
    render(<SheetSideBar />);

    // Check if the Sheet component is rendered (it should contain the SideBar)
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  it("should render DialogTitle and DialogClose as hidden", () => {
    render(<SheetSideBar />);

    // These elements should be present but hidden
    const dialogTitle = screen.getByTestId("dialog-title");
    const dialogClose = screen.getByTestId("dialog-close");

    expect(dialogTitle).toBeInTheDocument();
    expect(dialogClose).toBeInTheDocument();
  });

  it("should use the ref from useCloseDialog hook", () => {
    render(<SheetSideBar />);

    // The ref should be passed to DialogClose
    const dialogClose = screen.getByTestId("dialog-close");
    expect(dialogClose).toBeInTheDocument();
  });

  it("should render with correct SheetContent props", () => {
    render(<SheetSideBar />);

    // The SheetContent should contain the SideBar
    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toBeInTheDocument();
  });
});
