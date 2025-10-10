import { useToast } from "@/hooks/use-toast";
import { sendResetPasswordEmail } from "@/services/auth";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// ForgotPasswordDialog.test.js
import React from "react";
import ForgotPasswordDialog from ".";

vi.mock("@/services/auth", () => ({
  sendResetPasswordEmail: vi.fn(),
}));

const mockToast = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(() => ({
    toast: mockToast,
  })),
}));

describe("ForgotPasswordDialog Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the dialog trigger and opens the dialog", () => {
    render(<ForgotPasswordDialog />);

    const trigger = screen.getByText(/forgot password\?/i);
    expect(trigger).toBeInTheDocument();

    fireEvent.click(trigger);

    const dialogTitle = screen.getByRole("heading", {
      name: /forgot password\?/i,
    });
    expect(dialogTitle).toBeInTheDocument();
    expect(
      screen.getByText(
        /a password reset link will be sent to your email to reset your password/i,
      ),
    ).toBeInTheDocument();
  });

  it("validates email input", async () => {
    render(<ForgotPasswordDialog />);

    const trigger = screen.getByText(/forgot password\?/i);
    fireEvent.click(trigger);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("please enter a valid email address."),
      ).toBeInTheDocument();
    });
  });

  it("handles successful password reset request", async () => {
    (sendResetPasswordEmail as jest.Mock).mockResolvedValueOnce({
      code: "20001",
    });

    render(<ForgotPasswordDialog />);

    const trigger = screen.getByText(/forgot password\?/i);
    fireEvent.click(trigger);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(sendResetPasswordEmail).toHaveBeenCalledWith("test@example.com");
      expect(mockToast).toHaveBeenCalledWith({
        description: "Reset password email sent successfully!",
      });
      expect(
        screen.getByText(/an account recovery email has been sent/i),
      ).toBeInTheDocument();
    });
  });

  it("handles failed password reset request", async () => {
    (sendResetPasswordEmail as jest.Mock).mockResolvedValueOnce({
      code: "40001",
      message: "Invalid email",
    });

    render(<ForgotPasswordDialog />);

    const trigger = screen.getByText(/forgot password\?/i);
    fireEvent.click(trigger);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(sendResetPasswordEmail).toHaveBeenCalledWith("test@example.com");
      expect(mockToast).toHaveBeenCalledWith({
        description: "Invalid email",
      });
    });
  });

  it("handles resend password functionality", async () => {
    (sendResetPasswordEmail as jest.Mock)
      .mockResolvedValueOnce({ code: "20001" })
      .mockResolvedValueOnce({ code: "20001" });

    render(<ForgotPasswordDialog />);

    const trigger = screen.getByText(/forgot password\?/i);
    fireEvent.click(trigger);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/an account recovery email has been sent/i),
      ).toBeInTheDocument();
    });

    const resendButton = screen.getByRole("button", {
      name: /resend password/i,
    });
    fireEvent.click(resendButton);

    await waitFor(() => {
      expect(sendResetPasswordEmail).toHaveBeenCalledTimes(2);
      expect(mockToast).toHaveBeenCalledWith({
        description: "Reset password email sent successfully!",
      });
    });
  });

  it("handles error during password reset request", async () => {
    (sendResetPasswordEmail as jest.Mock).mockRejectedValueOnce(
      new Error("Network error"),
    );

    render(<ForgotPasswordDialog />);

    const trigger = screen.getByText(/forgot password\?/i);
    fireEvent.click(trigger);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(sendResetPasswordEmail).toHaveBeenCalledWith("test@example.com");
      expect(mockToast).toHaveBeenCalledWith({
        description: "An error occurred. Please try again.",
      });
    });
  });
});
