import ProjectEditDialog from "@/components/ProjectEditDialog";
import { ProjectEditForm } from "@/constants/form/project";
import { useToast } from "@/hooks/use-toast";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

vi.mock("@/constants/form/project", () => ({
  ProjectEditForm: vi.fn().mockReturnValue({
    parse: vi.fn(),
  }),
}));

describe("ProjectEditDialog Component", () => {
  const mockToast = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should render create dialog when type is 'create'", () => {
    render(<ProjectEditDialog type="create" onSubmit={mockOnSubmit} />);
    screen.debug();
    // 验证触发按钮 (Trigger)
    expect(screen.getByText("create")).toBeInTheDocument();

    // 点击触发按钮 (Trigger) 打开对话框
    fireEvent.click(screen.getByText("create"));

    // 验证对话框标题
    expect(screen.getByText("create project")).toBeInTheDocument();
    console.log(
      screen.getAllByLabelText("project name").length,
      "getAllByLabelText==",
    );
    // // 验证表单字段和按钮
    // expect(screen.getByLabelText("project name")).toBeInTheDocument();
    // expect(screen.getByLabelText("domain name")).toBeInTheDocument();
    // expect(screen.getByText("cancel")).toBeInTheDocument();
    // expect(screen.getByText("create")).toBeInTheDocument();
  });

  //   it("should render edit dialog when type is 'edit'", () => {
  //     render(
  //       <ProjectEditDialog
  //         type="edit"
  //         name="Test Project"
  //         domainName="test.com"
  //         onSubmit={mockOnSubmit}
  //       />
  //     );

  //     // 验证触发按钮 (Trigger)
  //     const editIcon = screen.getByRole("img", { name: /edit action/i });
  //     expect(editIcon).toBeInTheDocument();

  //     // 点击触发按钮 (Trigger) 打开对话框
  //     fireEvent.click(editIcon);

  //     // 验证对话框标题
  //     expect(screen.getByText("edit project")).toBeInTheDocument();

  //     // 验证表单初始值
  //     const nameInput = screen.getByLabelText("project name") as HTMLInputElement;
  //     const domainNameInput = screen.getByLabelText(
  //       "domain name"
  //     ) as HTMLInputElement;
  //     expect(nameInput.value).toBe("Test Project");
  //     expect(domainNameInput.value).toBe("test.com");

  //     // 验证按钮
  //     expect(screen.getByText("save")).toBeInTheDocument();
  //   });

  //   it("should submit form correctly on valid input", async () => {
  //     render(<ProjectEditDialog type="create" onSubmit={mockOnSubmit} />);

  //     // 打开对话框
  //     fireEvent.click(screen.getByText("create"));

  //     // 填写表单
  //     fireEvent.change(screen.getByLabelText("project name"), {
  //       target: { value: "New Project" },
  //     });
  //     fireEvent.change(screen.getByLabelText("domain name"), {
  //       target: { value: "example.com" },
  //     });

  //     // 点击提交按钮
  //     fireEvent.click(screen.getByText("create"));

  //     // 验证表单提交
  //     await waitFor(() => {
  //       expect(mockOnSubmit).toHaveBeenCalledWith({
  //         name: "New Project",
  //         domainName: "example.com",
  //       });
  //     });

  //     // 验证 Toast 成功提示
  //     expect(mockToast).toHaveBeenCalledWith({
  //       title: "",
  //       description: "successfully created",
  //     });

  //     // 验证对话框关闭
  //     await waitFor(() => {
  //       expect(screen.queryByText("create project")).not.toBeInTheDocument();
  //     });
  //   });

  //   it("should handle validation error and not submit invalid form", async () => {
  //     render(<ProjectEditDialog type="create" onSubmit={mockOnSubmit} />);

  //     // 打开对话框
  //     fireEvent.click(screen.getByText("create"));

  //     // 不填写表单，直接点击提交
  //     fireEvent.click(screen.getByText("create"));

  //     // 验证表单提交未触发
  //     await waitFor(() => {
  //       expect(mockOnSubmit).not.toHaveBeenCalled();
  //     });

  //     // 验证 Toast 没有成功提示
  //     expect(mockToast).not.toHaveBeenCalled();
  //   });

  //   it("should display toast error message on form submission failure", async () => {
  //     const mockError = new Error("Submission failed");
  //     mockOnSubmit.mockRejectedValueOnce(mockError);

  //     render(<ProjectEditDialog type="create" onSubmit={mockOnSubmit} />);

  //     // 打开对话框
  //     fireEvent.click(screen.getByText("create"));

  //     // 填写表单
  //     fireEvent.change(screen.getByLabelText("project name"), {
  //       target: { value: "New Project" },
  //     });
  //     fireEvent.change(screen.getByLabelText("domain name"), {
  //       target: { value: "example.com" },
  //     });

  //     // 点击提交按钮
  //     fireEvent.click(screen.getByText("create"));

  //     // 验证错误 Toast 显示
  //     await waitFor(() => {
  //       expect(mockToast).toHaveBeenCalledWith({
  //         title: "error",
  //         description: "something error",
  //       });
  //     });

  //     // 验证加载状态重置
  //     const buttonText = screen.getByText("create");
  //     expect(buttonText).toBeInTheDocument();
  //   });

  //   it("should reset form on dialog reopen", async () => {
  //     render(<ProjectEditDialog type="create" onSubmit={mockOnSubmit} />);

  //     // 打开对话框
  //     fireEvent.click(screen.getByText("create"));

  //     // 填写表单
  //     fireEvent.change(screen.getByLabelText("project name"), {
  //       target: { value: "New Project" },
  //     });

  //     // 关闭并重新打开对话框
  //     fireEvent.click(screen.getByText("cancel"));
  //     fireEvent.click(screen.getByText("create"));

  //     // 验证表单已重置
  //     const nameInput = screen.getByLabelText("project name") as HTMLInputElement;
  //     expect(nameInput.value).toBe("");
  //   });
});
