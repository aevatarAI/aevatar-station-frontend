import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import VerificationPage from ".";

describe("Verification Component", () => {
  it("renders correctly", () => {
    render(<VerificationPage />);
    expect(screen.getByText("verification")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("enter verification code"),
    ).toBeInTheDocument();
    expect(screen.getByText("register")).toBeInTheDocument();
    expect(screen.getByText("resend email")).toBeInTheDocument();
  });
});
