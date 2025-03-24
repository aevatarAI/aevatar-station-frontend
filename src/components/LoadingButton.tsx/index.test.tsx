import LoadingButton from "@/components/LoadingButton.tsx";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/assets/loading.svg?react", () => ({
  __esModule: true,
  default: ({ className }: { className: string }) => (
    <div data-testid="loading-icon" className={className}>
      Loading...
    </div>
  ),
}));

describe("LoadingButton Component", () => {
  const mockOnClick = vi.fn();
  const mockOnLoadingChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the button with provided children", () => {
    render(<LoadingButton>Click Me</LoadingButton>);

    const button = screen.getByRole("button");

    // 验证按钮渲染
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click Me"); // 确认内容
  });

  it("should apply custom className to the button", () => {
    render(<LoadingButton className="custom-class">Click Me</LoadingButton>);

    const button = screen.getByRole("button");

    // 验证 className
    expect(button).toHaveClass("custom-class");
  });

  it("should show loading icon during async operation", async () => {
    const mockAsync = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100)) as any,
    );

    render(
      <LoadingButton onClick={mockAsync} onLoadingChange={mockOnLoadingChange}>
        Click Me
      </LoadingButton>,
    );

    const button = screen.getByRole("button");

    // 点击按钮
    fireEvent.click(button);

    // 验证加载状态
    expect(screen.getByTestId("loading-icon")).toBeInTheDocument();

    // 验证 onLoadingChange 回调
    expect(mockOnLoadingChange).toHaveBeenCalledWith(true); // 加载中被触发

    // 等待异步操作完成
    await waitFor(() => {
      expect(mockAsync).toHaveBeenCalled();
    });

    // 验证加载状态被移除
    await waitFor(() => {
      expect(screen.queryByTestId("loading-icon")).not.toBeInTheDocument();
    });

    // 验证 onLoadingChange 回调
    expect(mockOnLoadingChange).toHaveBeenCalledWith(false); // 加载结束被触发
  });

  it("should handle onClick and stop loading after async operation", async () => {
    const mockAsync = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 100);
        }),
    );

    render(<LoadingButton onClick={mockAsync}>Click Me</LoadingButton>);

    const button = screen.getByRole("button");

    // 点击按钮
    fireEvent.click(button);

    // 验证 onClick 被调用
    await waitFor(() => {
      expect(mockAsync).toHaveBeenCalledTimes(1);
    });

    // 验证加载状态
    expect(screen.getByTestId("loading-icon")).toBeInTheDocument();

    // 等待异步函数完成
    await waitFor(() => {
      expect(screen.queryByTestId("loading-icon")).not.toBeInTheDocument();
    });
  });

  it("should not crash if onClick is not provided", async () => {
    render(<LoadingButton>Click Me</LoadingButton>);

    const button = screen.getByRole("button");

    // 点击按钮
    fireEvent.click(button);

    // 验证不会抛出错误
    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    // 验证没有 loading 图标
    expect(screen.queryByTestId("loading-icon")).not.toBeInTheDocument();
  });

  it("should pass additional props to the underlying button", () => {
    render(
      <LoadingButton type="submit" form="test-form">
        Submit
      </LoadingButton>,
    );

    const button = screen.getByRole("button");

    // 验证额外属性传递
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("form", "test-form");
  });
});
