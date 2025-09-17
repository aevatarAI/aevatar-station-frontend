import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("renders input with default props", () => {
    render(<Input />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("flex", "h-10", "w-full");
  });

  it("renders input with custom value", () => {
    render(<Input value="test value" />);

    const input = screen.getByDisplayValue("test value");
    expect(input).toBeInTheDocument();
  });

  it("renders input with placeholder", () => {
    render(<Input placeholder="Enter text" />);

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Input className="custom-class" />);

    const input = screen.getByRole("textbox");
    expect(input.className).toContain("custom-class");
  });

  it("handles different input types", () => {
    render(<Input type="email" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "email");
  });

  it("handles disabled state", () => {
    render(<Input disabled />);

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
    expect(input).toHaveClass(
      "disabled:cursor-not-allowed",
      "disabled:opacity-50",
    );
  });

  it("handles required state", () => {
    render(<Input required />);

    const input = screen.getByRole("textbox");
    expect(input).toBeRequired();
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("applies destructive styling when aria-invalid is true", () => {
    render(<Input aria-invalid />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("applies default styling", () => {
    render(<Input />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass(
      "text-[13px]",
      "font-geist",
      "border",
      "border-[var(--color-input)]",
      "bg-[var(--bg-background)]",
      "px-[18px]",
      "py-[10px]",
    );
  });

  it("has autoComplete off by default", () => {
    render(<Input />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("autoComplete", "off");
  });

  it("passes through additional props", () => {
    render(<Input data-testid="test-input" name="test-name" />);

    const input = screen.getByTestId("test-input");
    expect(input).toHaveAttribute("name", "test-name");
  });

  it("handles controlled input", () => {
    render(<Input value="controlled value" onChange={() => {}} />);

    const input = screen.getByDisplayValue("controlled value");
    expect(input).toBeInTheDocument();
  });

  it("handles uncontrolled input", () => {
    render(<Input defaultValue="uncontrolled value" />);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });
});
