import { useNavigate } from "@/hooks/navigate";
import { resetPassword, verifyResetToken } from "@/services/auth";
import { sleep } from "@etransfer/utils";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ResetPassword from ".";

vi.mock("@/hooks/navigate");
vi.mock("@/services/auth");
vi.mock("@etransfer/utils", () => ({
  sleep: vi.fn(() => Promise.resolve()),
}));

describe("ResetPassword Component", () => {
  const mockNavigate = vi.fn();
  const mockVerifyResetToken = vi.fn();
  const mockResetPassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as any).mockReturnValue(mockNavigate);
    (verifyResetToken as any).mockImplementation(mockVerifyResetToken);
    (resetPassword as any).mockImplementation(mockResetPassword);
  });

  it("renders the form correctly", () => {
    render(<ResetPassword />);
    expect(screen.getByText("Reset password")).toBeInTheDocument();
    expect(screen.getByLabelText("New password*")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm new password*")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("validates password requirements", async () => {
    render(<ResetPassword />);

    const passwordInput = screen.getByLabelText("New password*");
    const confirmInput = screen.getByLabelText("Confirm new password*");
    const submitButton = screen.getByText("Submit");

    // Test password too short
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: "short" } });
      fireEvent.change(confirmInput, { target: { value: "short" } });
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(
        screen.getByText("password must be at least 6 characters long"),
      ).toBeInTheDocument();
    });

    // Test password without special character
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: "Password123" } });
      fireEvent.change(confirmInput, { target: { value: "Password123" } });
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(
        screen.getByText(
          "password must contain at least one non-alphanumeric character",
        ),
      ).toBeInTheDocument();
    });

    // Test password without uppercase
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: "password123!" } });
      fireEvent.change(confirmInput, { target: { value: "password123!" } });
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(
        screen.getByText(
          "password must contain at least one uppercase letter ('A'-'Z')",
        ),
      ).toBeInTheDocument();
    });

    // Test password without lowercase
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: "PASSWORD123!" } });
      fireEvent.change(confirmInput, { target: { value: "PASSWORD123!" } });
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(
        screen.getByText(
          "password must contain at least one lowercase letter ('a'-'z')",
        ),
      ).toBeInTheDocument();
    });
  });

  it("validates password confirmation", async () => {
    render(<ResetPassword />);

    const passwordInput = screen.getByLabelText("New password*");
    const confirmInput = screen.getByLabelText("Confirm new password*");
    const submitButton = screen.getByText("Submit");

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: "Password123!" } });
      fireEvent.change(confirmInput, { target: { value: "Different123!" } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("handles successful password reset", async () => {
    mockVerifyResetToken.mockResolvedValue({ code: "20000", data: true });
    mockResetPassword.mockResolvedValue({ code: "20001" });

    render(<ResetPassword />);

    const passwordInput = screen.getByLabelText("New password*");
    const confirmInput = screen.getByLabelText("Confirm new password*");
    const submitButton = screen.getByText("Submit");

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: "Password123!" } });
      fireEvent.change(confirmInput, { target: { value: "Password123!" } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockVerifyResetToken).toHaveBeenCalled();
      expect(mockResetPassword).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("handles invalid reset token", async () => {
    mockVerifyResetToken.mockResolvedValue({
      code: "40000",
      message: "Invalid token",
    });

    render(<ResetPassword />);

    const passwordInput = screen.getByLabelText("New password*");
    const confirmInput = screen.getByLabelText("Confirm new password*");
    const submitButton = screen.getByText("Submit");

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: "Password123!" } });
      fireEvent.change(confirmInput, { target: { value: "Password123!" } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockVerifyResetToken).toHaveBeenCalled();
      expect(mockResetPassword).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("handles reset password failure", async () => {
    mockVerifyResetToken.mockResolvedValue({ code: "20000", data: true });
    mockResetPassword.mockResolvedValue({
      code: "40000",
      message: "Reset failed",
    });

    render(<ResetPassword />);

    const passwordInput = screen.getByLabelText("New password*");
    const confirmInput = screen.getByLabelText("Confirm new password*");
    const submitButton = screen.getByText("Submit");

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: "Password123!" } });
      fireEvent.change(confirmInput, { target: { value: "Password123!" } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockVerifyResetToken).toHaveBeenCalled();
      expect(mockResetPassword).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
