import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Register from ".";

// Mock sleep
vi.mock("@etransfer/utils", () => ({
  sleep: vi.fn(() => Promise.resolve()),
}));
vi.mock("@/hooks/navigate");
vi.mock("@/services/auth");

describe("Register Component", () => {
  it("renders the form correctly", () => {
    render(<Register />);

    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password"),
    ).toBeInTheDocument();
    expect(screen.getByText("Send verification code")).toBeInTheDocument();
  });
});
