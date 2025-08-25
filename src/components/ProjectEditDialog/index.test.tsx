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
    expect(screen.getByText("create")).toBeInTheDocument();

    fireEvent.click(screen.getByText("create"));

    expect(screen.getByText("create project")).toBeInTheDocument();
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

  //     const editIcon = screen.getByRole("img", { name: /edit action/i });
  //     expect(editIcon).toBeInTheDocument();

  //     fireEvent.click(editIcon);

  //     expect(screen.getByText("edit project")).toBeInTheDocument();

  //     const nameInput = screen.getByLabelText("project name") as HTMLInputElement;
  //     const domainNameInput = screen.getByLabelText(
  //       "domain name"
  //     ) as HTMLInputElement;
  //     expect(nameInput.value).toBe("Test Project");
  //     expect(domainNameInput.value).toBe("test.com");

  //     expect(screen.getByText("save")).toBeInTheDocument();
  //   });

  //   it("should submit form correctly on valid input", async () => {
  //     render(<ProjectEditDialog type="create" onSubmit={mockOnSubmit} />);

  //     fireEvent.click(screen.getByText("create"));

  //     fireEvent.change(screen.getByLabelText("project name"), {
  //       target: { value: "New Project" },
  //     });
  //     fireEvent.change(screen.getByLabelText("domain name"), {
  //       target: { value: "example.com" },
  //     });

  //     fireEvent.click(screen.getByText("create"));

  //     await waitFor(() => {
  //       expect(mockOnSubmit).toHaveBeenCalledWith({
  //         name: "New Project",
  //         domainName: "example.com",
  //       });
  //     });

  //     expect(mockToast).toHaveBeenCalledWith({
  //       title: "",
  //       description: "successfully created",
  //     });

  //     await waitFor(() => {
  //       expect(screen.queryByText("create project")).not.toBeInTheDocument();
  //     });
  //   });

  //   it("should handle validation error and not submit invalid form", async () => {
  //     render(<ProjectEditDialog type="create" onSubmit={mockOnSubmit} />);

  //     fireEvent.click(screen.getByText("create"));

  //     fireEvent.click(screen.getByText("create"));

  //     await waitFor(() => {
  //       expect(mockOnSubmit).not.toHaveBeenCalled();
  //     });

  //     expect(mockToast).not.toHaveBeenCalled();
  //   });

  //   it("should display toast error message on form submission failure", async () => {
  //     const mockError = new Error("Submission failed");
  //     mockOnSubmit.mockRejectedValueOnce(mockError);

  //     render(<ProjectEditDialog type="create" onSubmit={mockOnSubmit} />);

  //     fireEvent.click(screen.getByText("create"));

  //     fireEvent.change(screen.getByLabelText("project name"), {
  //       target: { value: "New Project" },
  //     });
  //     fireEvent.change(screen.getByLabelText("domain name"), {
  //       target: { value: "example.com" },
  //     });

  //     fireEvent.click(screen.getByText("create"));

  //     await waitFor(() => {
  //       expect(mockToast).toHaveBeenCalledWith({
  //         title: "error",
  //         description: "something error",
  //       });
  //     });

  //     const buttonText = screen.getByText("create");
  //     expect(buttonText).toBeInTheDocument();
  //   });

  //   it("should reset form on dialog reopen", async () => {
  //     render(<ProjectEditDialog type="create" onSubmit={mockOnSubmit} />);

  //     fireEvent.click(screen.getByText("create"));

  //     fireEvent.change(screen.getByLabelText("project name"), {
  //       target: { value: "New Project" },
  //     });

  //     fireEvent.click(screen.getByText("cancel"));
  //     fireEvent.click(screen.getByText("create"));

  //     const nameInput = screen.getByLabelText("project name") as HTMLInputElement;
  //     expect(nameInput.value).toBe("");
  //   });
});
