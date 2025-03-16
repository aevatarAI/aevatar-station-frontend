import { useNavigate } from "@/hooks/navigate";
import { sendRegisterCode } from "@/services/auth";
import { sleep } from "@etransfer/utils";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

    expect(screen.getByText("register")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("enter your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("enter your password"),
    ).toBeInTheDocument();
    expect(screen.getByText("send verification code")).toBeInTheDocument();
  });
});
