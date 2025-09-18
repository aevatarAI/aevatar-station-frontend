import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import DeleteDialog from "./index";

// Mock SVG imports
vi.mock("@/assets/delete_action.svg?react", () => ({
  default: ({ className, role }: { className?: string; role?: string }) => (
    <div data-testid="delete-icon" className={className} role={role} />
  ),
}));

vi.mock("@/assets/tip_icon.svg?react", () => ({
  default: () => <div data-testid="tip-icon" />,
}));

// Mock LoadingButton component
vi.mock("@/components/LoadingButton.tsx", () => ({
  default: ({ children, onClick, className }: any) => (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

// Mock useToast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

// Mock Radix UI Dialog components
vi.mock("@/components/ui/dialog", () => {
  let isOpen = false;
  let onOpenChange = (open: boolean) => {
    isOpen = open;
  };

  return {
    Dialog: ({ children, open, onOpenChange: onChange }: any) => {
      isOpen = open;
      onOpenChange = onChange;
      return (
        <div data-testid="dialog" data-open={isOpen}>
          {children}
        </div>
      );
    },
    DialogContent: ({ children }: any) => (
      <div
        data-testid="dialog-content"
        style={{ display: isOpen ? "block" : "none" }}
      >
        {children}
      </div>
    ),
    DialogHeader: () => <div data-testid="dialog-header" />,
    DialogTrigger: ({ children }: any) => (
      <div
        data-testid="dialog-trigger"
        onClick={() => {
          onOpenChange(true);
          children.props.onClick?.();
        }}
      >
        {children}
      </div>
    ),
  };
});

// Mock Radix UI Dialog primitives
vi.mock("@radix-ui/react-dialog", () => ({
  DialogTitle: () => <div data-testid="dialog-title" />,
  DialogDescription: () => <div data-testid="dialog-description" />,
}));

// Mock Radix UI Visually Hidden
vi.mock("@radix-ui/react-visually-hidden", () => ({
  VisuallyHidden: ({ children }: any) => (
    <div data-testid="visually-hidden">{children}</div>
  ),
}));

describe("DeleteDialog Component", () => {
  const mockOnYes = vi.fn();
  const defaultProps = {
    title: "Delete Confirmation",
    description: "Are you sure you want to delete this item?",
    onYes: mockOnYes,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render delete icon when not disabled", () => {
    render(<DeleteDialog {...defaultProps} data-testid="delete-button" />);
    const deleteButton = screen.getByTestId("delete-button");
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("cursor-pointer");
  });

  it("should render disabled delete icon when disabled prop is true", () => {
    render(
      <DeleteDialog
        {...defaultProps}
        disabled={true}
        data-testid="delete-button"
      />,
    );
    const deleteButton = screen.getByTestId("delete-button");
    expect(deleteButton).toHaveClass("opacity-50");
  });

  it("should open dialog when delete icon is clicked", async () => {
    const user = userEvent.setup();
    render(<DeleteDialog {...defaultProps} data-testid="delete-button" />);

    await user.click(screen.getByTestId("delete-button"));

    await waitFor(() => {
      const dialog = screen.getByTestId("dialog");
      expect(dialog).toHaveAttribute("data-open", "true");
      expect(screen.getByTestId("dialog-content")).toHaveStyle({
        display: "block",
      });
    });
  });

  it("should display title and description in dialog", async () => {
    const user = userEvent.setup();
    render(<DeleteDialog {...defaultProps} data-testid="delete-button" />);

    await user.click(screen.getByTestId("delete-button"));

    await waitFor(() => {
      const dialogContent = screen.getByTestId("dialog-content");
      expect(dialogContent).toHaveTextContent(defaultProps.title);
      expect(dialogContent).toHaveTextContent(defaultProps.description);
    });
  });

  it("should close dialog when cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(<DeleteDialog {...defaultProps} data-testid="delete-button" />);

    await user.click(screen.getByTestId("delete-button"));
    await user.click(screen.getByText("cancel"));

    await waitFor(() => {
      const dialog = screen.getByTestId("dialog");
      expect(dialog).toHaveAttribute("data-open", "false");
      expect(screen.getByTestId("dialog-content")).toHaveStyle({
        display: "none",
      });
    });
  });

  it("should call onYes and close dialog when yes button is clicked", async () => {
    const user = userEvent.setup();
    render(<DeleteDialog {...defaultProps} data-testid="delete-button" />);

    await user.click(screen.getByTestId("delete-button"));
    await user.click(screen.getByText("yes"));

    await waitFor(() => {
      expect(mockOnYes).toHaveBeenCalled();
      const dialog = screen.getByTestId("dialog");
      expect(dialog).toHaveAttribute("data-open", "false");
      expect(screen.getByTestId("dialog-content")).toHaveStyle({
        display: "none",
      });
    });
  });

  it("should not show description when description prop is not provided", async () => {
    const user = userEvent.setup();
    render(
      <DeleteDialog
        title="Delete Confirmation"
        onYes={mockOnYes}
        data-testid="delete-button"
      />,
    );

    await user.click(screen.getByTestId("delete-button"));

    await waitFor(() => {
      const dialogContent = screen.getByTestId("dialog-content");
      expect(dialogContent).toHaveTextContent("Delete Confirmation");
      expect(dialogContent).not.toHaveTextContent(
        "Are you sure you want to delete this item?",
      );
    });
  });

  it("should handle async onYes callback", async () => {
    const asyncOnYes = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );
    const user = userEvent.setup();
    render(
      <DeleteDialog
        {...defaultProps}
        onYes={asyncOnYes}
        data-testid="delete-button"
      />,
    );

    await user.click(screen.getByTestId("delete-button"));
    await user.click(screen.getByText("yes"));

    await waitFor(() => {
      expect(asyncOnYes).toHaveBeenCalled();
      const dialog = screen.getByTestId("dialog");
      expect(dialog).toHaveAttribute("data-open", "false");
      expect(screen.getByTestId("dialog-content")).toHaveStyle({
        display: "none",
      });
    });
  });
});
