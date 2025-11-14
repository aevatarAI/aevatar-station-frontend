import { useToast } from "@/hooks/use-toast";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CreateRoleDialog from "./index";

// Mock the toast hook
const mockToast = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(() => ({
    toast: mockToast,
  })),
}));

describe("CreateRoleDialog", () => {
  const mockOnCreate = vi.fn(() => Promise.resolve());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the dialog trigger button", () => {
    render(<CreateRoleDialog />);
    expect(screen.getByText("Add Role")).toBeInTheDocument();
  });

  it("opens dialog when trigger button is clicked", () => {
    render(<CreateRoleDialog />);
    fireEvent.click(screen.getByText("Add Role"));
    expect(screen.getByText("Create Role")).toBeInTheDocument();
  });

  it("closes dialog when cancel button is clicked", () => {
    render(<CreateRoleDialog />);
    fireEvent.click(screen.getByText("Add Role"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Create Role")).not.toBeInTheDocument();
  });

  it("shows loading state when submitting", async () => {
    const user = userEvent.setup();
    const mockOnCreateLong = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(<CreateRoleDialog onCreate={mockOnCreateLong} />);
    await user.click(screen.getByText("Add Role"));

    const roleNameInput = screen.getByRole("textbox");
    await user.type(roleNameInput, "Test Role");

    const submitButton = screen.getByRole("button", { name: /create/i });
    await user.click(submitButton);

    // Check for loading text and icon
    await waitFor(() => {
      expect(screen.getByText("Creating")).toBeInTheDocument();
      expect(screen.getByTestId("loading-icon")).toBeInTheDocument();
    });

    // Wait for the loading state to finish
    await waitFor(() => {
      expect(screen.queryByText("Creating")).not.toBeInTheDocument();
    });
  });

  it("calls onCreate with form values when submitted", async () => {
    const user = userEvent.setup();
    render(<CreateRoleDialog onCreate={mockOnCreate} />);
    await user.click(screen.getByText("Add Role"));

    const roleNameInput = screen.getByRole("textbox");
    await user.type(roleNameInput, "Test Role");

    const submitButton = screen.getByRole("button", { name: /create/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalledWith({
        roleName: "Test Role",
      });
    });
  });

  it("shows success toast after successful creation", async () => {
    const user = userEvent.setup();
    render(<CreateRoleDialog onCreate={mockOnCreate} />);
    await user.click(screen.getByText("Add Role"));

    const roleNameInput = screen.getByRole("textbox");
    await user.type(roleNameInput, "Test Role");

    const submitButton = screen.getByRole("button", { name: /create/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "",
        description: "successfully created",
      });
    });
  });

  it("resets form when dialog is opened", async () => {
    const user = userEvent.setup();
    render(<CreateRoleDialog />);
    await user.click(screen.getByText("Add Role"));

    const roleNameInput = screen.getByRole("textbox");
    await user.type(roleNameInput, "Test Role");

    await user.click(screen.getByText("Cancel"));
    await user.click(screen.getByText("Add Role"));

    const newRoleNameInput = screen.getByRole("textbox");
    expect(newRoleNameInput).toHaveValue("");
  });
});
