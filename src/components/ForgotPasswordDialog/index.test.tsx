import { sendResetPasswordEmail } from "@/services/auth";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// ForgotPasswordDialog.test.js
import React from "react";
import ForgotPasswordDialog from ".";

vi.mock("@/services/auth", () => ({
  sendResetPasswordEmail: vi.fn(),
}));

describe("ForgotPasswordDialog Component", () => {
  it("renders the dialog trigger and opens the dialog", () => {
    render(<ForgotPasswordDialog />);

    // Check if the trigger is rendered
    const trigger = screen.getByText("forgot password?");
    expect(trigger).toBeInTheDocument();

    // Open the dialog
    fireEvent.click(trigger);

    // Check if the dialog content is rendered
    expect(screen.getByText("forgot Password?")).toBeInTheDocument();
    expect(
      screen.getByText(
        /a password reset link will be sent to your email to reset your password/i,
      ),
    ).toBeInTheDocument();
  });
});
