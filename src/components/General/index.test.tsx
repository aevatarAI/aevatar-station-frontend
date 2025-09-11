import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import General from "./index";

describe("General Component", () => {
  const mockOnConfirm = vi.fn();
  const defaultProps = {
    header: "Test Header",
    title: "Test Title",
    onConfirm: mockOnConfirm,
  };

  it("renders with default props", () => {
    render(<General {...defaultProps} />);

    expect(screen.getByText("Test Header")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("renders with custom button props", () => {
    const customButtonProps = {
      placement: "top-right" as const,
      text: "Custom Save",
      className: "custom-class",
    };

    render(<General {...defaultProps} buttonProps={customButtonProps} />);

    const button = screen.getByText("Custom Save");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("custom-class");
  });

  it("handles input changes", () => {
    render(<General {...defaultProps} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test input" } });

    expect(input).toHaveValue("test input");
  });

  it("handles readonly mode", () => {
    render(<General {...defaultProps} readonly />);

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();

    // Button should not be present in readonly mode
    expect(screen.queryByText("Save")).not.toBeInTheDocument();
  });

  it("calls onConfirm with input value", async () => {
    render(<General {...defaultProps} />);

    const input = screen.getByRole("textbox");
    const button = screen.getByText("Save");

    fireEvent.change(input, { target: { value: "test value" } });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockOnConfirm).toHaveBeenCalledWith("test value");
  });

  it("does not call onConfirm with empty input", async () => {
    render(<General {...defaultProps} />);

    const button = screen.getByText("Save");
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it("renders extra input when provided", () => {
    const extraInput = <div data-testid="extra-input">Extra Input</div>;

    render(<General {...defaultProps} extraInput={extraInput} />);

    expect(screen.getByTestId("extra-input")).toBeInTheDocument();
  });

  it("updates input value through ref", () => {
    const ref = { current: null };
    render(<General {...defaultProps} ref={ref} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");

    act(() => {
      ref.current?.updateInput("new value");
    });

    expect(input).toHaveValue("new value");
  });

  it("renders with default value", () => {
    render(<General {...defaultProps} defaultValue="initial value" />);

    expect(screen.getByRole("textbox")).toHaveValue("initial value");
  });

  it("renders with input placeholder", () => {
    render(<General {...defaultProps} inputPlaceholder="Enter text here" />);

    expect(screen.getByPlaceholderText("Enter text here")).toBeInTheDocument();
  });
});
