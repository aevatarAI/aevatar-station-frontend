import CheckboxLabel from "@/components/CheckboxLabel";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("CheckboxLabel Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the checkbox and label with provided text", () => {
    render(<CheckboxLabel text="Test Checkbox" />);

    // 验证 Checkbox 存在
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();

    // 验证 Label 渲染
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

    // 验证 Wrapper 的 "wrapperClassName"
    const wrapper = screen.getByText("Test Checkbox").closest("div");
    expect(wrapper).toHaveClass("wrapper-class");

    // 验证 Checkbox 的 "className"
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveClass("checkbox-class");
  });

  it("should trigger onChange event when checkbox is clicked", () => {
    const onChangeMock = vi.fn();

    render(
      <CheckboxLabel text="Test Checkbox" onCheckedChange={onChangeMock} />,
    );

    const checkbox = screen.getByRole("checkbox");

    // 点击 Checkbox
    fireEvent.click(checkbox);

    // 验证 Checkbox 更改事件
    expect(onChangeMock).toHaveBeenCalled();
    expect(onChangeMock).toHaveBeenCalledWith(true); // 默认是未选中 -> 选中
  });

  it("should respect the disabled prop", () => {
    render(<CheckboxLabel text="Test Checkbox" disabled />);

    const checkbox = screen.getByRole("checkbox");

    // 验证 Checkbox 不可用
    expect(checkbox).toBeDisabled();
  });

  it("should support controlled checked prop", () => {
    render(<CheckboxLabel text="Test Checkbox" checked />);

    const checkbox = screen.getByRole("checkbox");

    // 验证 Checkbox 被选中
    expect(checkbox).toBeChecked();
  });

  it("should render default styles for checkbox and label", () => {
    render(<CheckboxLabel text="Checkbox with style" />);

    const checkbox = screen.getByRole("checkbox");
    const label = screen.getByText("Checkbox with style");

    // 验证默认样式
    expect(checkbox).toHaveClass("border-[#989DA0] bg-white w-[14px] h-[14px]");
    expect(label).toHaveClass(
      "font-normal text-[11px] leading-[14px] mb-0 !mt-0 font-pro",
    );
  });
});
