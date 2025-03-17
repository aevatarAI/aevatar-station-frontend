import { useNavigate } from "@/hooks/navigate";
import { resetPassword, verifyResetToken } from "@/services/auth";
import { sleep } from "@etransfer/utils";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ResetPassword from ".";

vi.mock("@/hooks/navigate");
vi.mock("@/services/auth");
vi.mock("@etransfer/utils", () => ({
  sleep: vi.fn(() => Promise.resolve()),
}));

describe("ResetPassword Component", () => {
  it("renders the form correctly", () => {
    render(<ResetPassword />);
    expect(screen.getByText("reset password")).toBeInTheDocument();
    expect(screen.getByLabelText("password*")).toBeInTheDocument();
    expect(
      screen.getByLabelText("confirm (repeat) the password*"),
    ).toBeInTheDocument();
    expect(screen.getByText("submit")).toBeInTheDocument();
  });
});
