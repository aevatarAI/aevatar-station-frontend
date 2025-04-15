import DeleteDialog from "@/components/DeleteDialog";
import { useToast } from "@/hooks/use-toast";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

describe("DeleteDialog Component", () => {
  const mockToast = vi.fn();
  const mockOnYes = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });
  });

  it("should render the DeleteDialog with correct title and description", () => {
    render(
      <DeleteDialog
        title="Confirm Deletion"
        description="Are you sure you want to delete?"
        onYes={mockOnYes}
      />,
    );

    // 验证 Delete 图标存在
    expect(screen.getByRole("img")).toBeInTheDocument();

    // 验证对话框内容未渲染
    expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Are you sure you want to delete?"),
    ).not.toBeInTheDocument();

    // 点击 Delete 图标后，验证对话框出现
    const openDialogTrigger = screen.getByRole("img");
    fireEvent.click(openDialogTrigger);

    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete?"),
    ).toBeInTheDocument();
  });

  it("should close dialog when Cancel button is clicked", async () => {
    render(
      <DeleteDialog
        title="Confirm Deletion"
        description="Are you sure you want to delete?"
        onYes={mockOnYes}
      />,
    );

    // 打开对话框
    const openDialogTrigger = screen.getByRole("img");
    fireEvent.click(openDialogTrigger);

    // 验证对话框内容已渲染
    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();

    // 点击 Cancel 按钮
    const cancelButton = screen.getByText("cancel");
    fireEvent.click(cancelButton);

    // 确认对话框已关闭
    await waitFor(() => {
      expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
    });
  });

  it("should call onYes and close dialog when yes button is clicked", async () => {
    render(
      <DeleteDialog
        title="Confirm Deletion"
        description="Are you sure you want to delete?"
        onYes={mockOnYes}
      />,
    );

    // 打开对话框
    const openDialogTrigger = screen.getByRole("img");
    fireEvent.click(openDialogTrigger);

    // 验证对话框内容已渲染
    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();

    // 点击 yes 按钮
    const yesButton = screen.getByText("yes");
    fireEvent.click(yesButton);

    // 确认 onYes 被调用
    await waitFor(() => {
      expect(mockOnYes).toHaveBeenCalledTimes(1);
    });

    // 确认对话框已关闭
    await waitFor(() => {
      expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
    });

    // 验证 toast 被调用
    expect(mockToast).toHaveBeenCalledWith({
      description: "successfully deleted",
    });
  });

  it("should handle async onYes function", async () => {
    const asyncOnYes = vi.fn().mockResolvedValueOnce(() => Promise.resolve());
    render(
      <DeleteDialog
        title="Confirm Deletion"
        description="Are you sure you want to delete?"
        onYes={asyncOnYes}
      />,
    );

    // 打开对话框
    const openDialogTrigger = screen.getByRole("img");
    fireEvent.click(openDialogTrigger);

    // 点击 yes 按钮
    const yesButton = screen.getByText("yes");
    fireEvent.click(yesButton);

    // 等待 asyncOnYes 完成
    await waitFor(() => {
      expect(asyncOnYes).toHaveBeenCalled();
    });

    // 验证 toast 被调用
    expect(mockToast).toHaveBeenCalledWith({
      description: "successfully deleted",
    });
  });

  it("should not call onYes if not provided", async () => {
    render(
      <DeleteDialog
        title="Confirm Deletion"
        description="Are you sure you want to delete?"
      />,
    );

    // 打开对话框
    const openDialogTrigger = screen.getByRole("img");
    fireEvent.click(openDialogTrigger);

    // 点击 yes 按钮
    const yesButton = screen.getByText("yes");
    fireEvent.click(yesButton);

    // 确认 onYes 不被调用
    await waitFor(() => {
      expect(mockOnYes).not.toHaveBeenCalled();
    });

    // 验证 toast 被调用
    expect(mockToast).toHaveBeenCalledWith({
      description: "successfully deleted",
    });
  });
});
