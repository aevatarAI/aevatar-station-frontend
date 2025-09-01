import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import VerificationPage from ".";

describe("Verification Component", () => {
  it("renders correctly", () => {
    render(<VerificationPage />);
    expect(screen.getByText("Verification")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter verification code"),
    ).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByText("Resend email")).toBeInTheDocument();
  });
});
