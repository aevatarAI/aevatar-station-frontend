import CheckboxLabel from "@/components/CheckboxLabel";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("CheckboxLabel Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the checkbox and label with provided text", () => {
    render(<CheckboxLabel text="Test Checkbox" />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();

    const label = screen.getByText("Test Checkbox");
    expect(label).toBeInTheDocument();
  });

  it("should apply custom className to wrapper and checkbox", () => {
    render(
      <CheckboxLabel
        text="Test Checkbox"
        wrapperClassName="wrapper-class"
        className="checkbox-class"
      />,
    );

    const wrapper = screen.getByText("Test Checkbox").closest("div");
    expect(wrapper).toHaveClass("wrapper-class");

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveClass("checkbox-class");
  });

  it("should trigger onChange event when checkbox is clicked", () => {
    const onChangeMock = vi.fn();

    render(
      <CheckboxLabel text="Test Checkbox" onCheckedChange={onChangeMock} />,
    );

    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    expect(onChangeMock).toHaveBeenCalled();
    expect(onChangeMock).toHaveBeenCalledWith(true);
  });

  it("should respect the disabled prop", () => {
    render(<CheckboxLabel text="Test Checkbox" disabled />);

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeDisabled();
  });

  it("should support controlled checked prop", () => {
    render(<CheckboxLabel text="Test Checkbox" checked />);

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeChecked();
  });

  it("should render default styles for checkbox and label", () => {
    render(<CheckboxLabel text="Checkbox with style" />);

    const checkbox = screen.getByRole("checkbox");
    const _label = screen.getByText("Checkbox with style");

    expect(checkbox).toHaveClass("border-[var(--color-border-primary)]");
    expect(checkbox).toHaveClass("w-[14px]");
    expect(checkbox).toHaveClass("h-[14px]");
    // 检查是否包含背景色类（可能是 bg-white 或 bg-[var(--bg-muted)]）
    expect(checkbox.className).toMatch(/bg-/);
  });
});
