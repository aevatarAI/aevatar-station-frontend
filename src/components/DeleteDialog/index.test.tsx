import DeleteDialog from "@/components/DeleteDialog";
import { useToast } from "@/hooks/use-toast";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

describe("DeleteDialog Component", () => {
  const mockToast = vi.fn();
  const mockOnYes = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });
  });

  it("should render the DeleteDialog with correct title and description", () => {
    render(
      <DeleteDialog
        title="Confirm Deletion"
        description="Are you sure you want to delete?"
        onYes={mockOnYes}
      />,
    );

    expect(screen.getByRole("img")).toBeInTheDocument();

    expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Are you sure you want to delete?"),
    ).not.toBeInTheDocument();

    const openDialogTrigger = screen.getByRole("img");
    fireEvent.click(openDialogTrigger);

    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete?"),
    ).toBeInTheDocument();
  });

  it("should close dialog when Cancel button is clicked", async () => {
    render(
      <DeleteDialog
        title="Confirm Deletion"
        description="Are you sure you want to delete?"
        onYes={mockOnYes}
      />,
    );

    const openDialogTrigger = screen.getByRole("img");
    fireEvent.click(openDialogTrigger);

    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();

    const cancelButton = screen.getByText("cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
    });
  });

  it("should call onYes and close dialog when yes button is clicked", async () => {
    render(
      <DeleteDialog
        title="Confirm Deletion"
        description="Are you sure you want to delete?"
        onYes={mockOnYes}
      />,
    );

    const openDialogTrigger = screen.getByRole("img");
    fireEvent.click(openDialogTrigger);

    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();

    const yesButton = screen.getByText("yes");
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(mockOnYes).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
    });

    expect(mockToast).toHaveBeenCalledWith({
      description: "successfully deleted",
    });
  });

  it("should handle async onYes function", async () => {
    const asyncOnYes = vi.fn().mockResolvedValueOnce(() => Promise.resolve());
    render(
      <DeleteDialog
        title="Confirm Deletion"
        description="Are you sure you want to delete?"
        onYes={asyncOnYes}
      />,
    );

    const openDialogTrigger = screen.getByRole("img");
    fireEvent.click(openDialogTrigger);

    const yesButton = screen.getByText("yes");
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(asyncOnYes).toHaveBeenCalled();
    });

    expect(mockToast).toHaveBeenCalledWith({
      description: "successfully deleted",
    });
  });

  it("should not call onYes if not provided", async () => {
    render(
      <DeleteDialog
        title="Confirm Deletion"
        description="Are you sure you want to delete?"
      />,
    );

    const openDialogTrigger = screen.getByRole("img");
    fireEvent.click(openDialogTrigger);

    const yesButton = screen.getByText("yes");
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(mockOnYes).not.toHaveBeenCalled();
    });

    expect(mockToast).toHaveBeenCalledWith({
      description: "successfully deleted",
    });
  });
});
