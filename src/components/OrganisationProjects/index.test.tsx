import { request } from "@/api";
import OrganisationProjects from "@/components/OrganisationProjects";
import { useToast } from "@/hooks/use-toast";
import useSetCurrentProject from "@/hooks/useSetCurrentProject";
import { useUpdateProjectHandler } from "@/hooks/useUpdateOrganisations";
import {
  CURRENT_ORGANIZATION_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useAtom } from "jotai";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("jotai", async () => {
  const actual = await vi.importActual("jotai");
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

vi.mock("@/api", () => ({
  request: {
    projects: {
      addProject: vi.fn(),
      editProject: vi.fn(),
      deleteProject: vi.fn(),
    },
  },
}));

vi.mock("@/hooks/useUpdateOrganisations", () => ({
  useUpdateProjectHandler: vi.fn(),
}));

vi.mock("@/hooks/useSetCurrentProject", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("@/components/ProjectEditDialog", () => ({
  __esModule: true,
  default: ({ type, onSubmit }: any) => (
    // biome-ignore lint/a11y/useButtonType: <explanation>
    <button
      onClick={() => onSubmit({ name: "Project Test", domainName: "test.com" })}
    >
      {type === "create" ? "Create Project" : "Edit Project"}
    </button>
  ),
}));

vi.mock("@/components/DeleteDialog", () => ({
  __esModule: true,
  default: ({ onYes }: any) => (
    // biome-ignore lint/a11y/useButtonType: <explanation>
    <button onClick={onYes}>Delete Project</button>
  ),
}));

vi.mock("@/hooks/useOrgPermissions", () => ({
  __esModule: true,
  useOrgPermissions: vi.fn(() => ({
    projectsCreate: true,
    projectsEdit: true,
    projectsDelete: true,
  })),
}));

describe("OrganisationProjects Component", () => {
  const mockToast = vi.fn();
  const mockUpdateProjectListHandler = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useAtom
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === PROJECT_LIST_ATOM) {
        return [
          [
            {
              id: "project-1",
              displayName: "Project 1",
              domainName: "project1.com",
            },
          ],
        ] as any;
      }
      if (atom === CURRENT_ORGANIZATION_ATOM) {
        return ["organization-1"];
      }
      return [null];
    });

    // Mock hooks
    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });

    // Mock useSetCurrentProject
    const mockSetCurrentProject = vi.fn();
    (useSetCurrentProject as any).mockReturnValue(mockSetCurrentProject);

    vi.mocked(useUpdateProjectHandler).mockReturnValue(
      mockUpdateProjectListHandler,
    );

    // Mock API
    vi.mocked(request.projects.addProject).mockResolvedValue({
      data: {
        id: "new-project-id",
        displayName: "Project Test",
        domainName: "test.com",
      },
    });
    vi.mocked(request.projects.editProject).mockResolvedValue({});
    vi.mocked(request.projects.deleteProject).mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render table with project operations", () => {
    render(<OrganisationProjects />);

    // Check if the table is rendered
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Domain Name")).toBeInTheDocument();
  });

  it("should call addProject API on create project", async () => {
    render(<OrganisationProjects />);
    // Trigger project creation
    const createButton = screen.getAllByText("Create Project");
    fireEvent.click(createButton[0]);

    // Verify API call
    await waitFor(() =>
      expect(request.projects.addProject).toHaveBeenCalledWith({
        data: {
          organizationId: "organization-1",
          displayName: "Project Test",
          domainName: "test.com",
        },
      }),
    );

    // Verify project list is updated
    expect(mockUpdateProjectListHandler).toHaveBeenCalledWith("organization-1");
  });

  //   it("should call editProject API on edit project", async () => {
  //     vi.mock("@/components/ProjectEditDialog", () => ({
  //       __esModule: true,
  //       default: ({ type, onSubmit }: any) => (
  //         // biome-ignore lint/a11y/useButtonType: <explanation>
  //         <button
  //           onClick={() =>
  //             onSubmit({ name: "Project Test", domainName: "test.com" })
  //           }>
  //           {"Edit Project"}
  //         </button>
  //       ),
  //     }));
  //     render(<OrganisationProjects />);
  //     screen.debug();

  //     // Trigger project edit
  //     const editButton = screen.getByText("Edit Project");
  //     fireEvent.click(editButton);

  //     // Verify API call
  //     // await waitFor(() =>
  //     //   expect(request.projects.editProject).toHaveBeenCalledWith({
  //     //     query: "project-1",
  //     //     data: {
  //     //       displayName: "Project Test",
  //     //       domainName: "test.com",
  //     //     },
  //     //   })
  //     // );

  //     // // Verify project list is updated
  //     // expect(mockUpdateProjectListHandler).toHaveBeenCalledWith("organization-1");
  //   });

  //   it("should call deleteProject API on delete project", async () => {
  //     render(<OrganisationProjects />);

  //     // Trigger project deletion
  //     const deleteButton = screen.getByText("Delete Project");
  //     fireEvent.click(deleteButton);

  //     // Verify API call
  //     await waitFor(() =>
  //       expect(request.projects.deleteProject).toHaveBeenCalledWith({
  //         query: "project-1",
  //       })
  //     );

  //     // Verify project list is updated
  //     expect(mockUpdateProjectListHandler).toHaveBeenCalledWith("organization-1");
  //   });

  // it("should show error toast when addProject API fails", async () => {
  //   // Mock API failure
  //   vi.mocked(request.projects.addProject).mockRejectedValue(
  //     new Error("Add Project Failed")
  //   );

  //   render(<OrganisationProjects />);

  //   // Trigger project creation
  //   const createButton = screen.getByText("Create Project");
  //   fireEvent.click(createButton);

  //   // Verify toast is shown
  //   await waitFor(() =>
  //     expect(mockToast).toHaveBeenCalledWith({
  //       description: "Add Project Failed",
  //     })
  //   );
  // });

  // it("should show error toast when editProject API fails", async () => {
  //   // Mock API failure
  //   vi.mocked(request.projects.editProject).mockRejectedValue(
  //     new Error("Edit Project Failed")
  //   );

  //   render(<OrganisationProjects />);

  //   // Trigger project edit
  //   const editButton = screen.getByText("Edit Project");
  //   fireEvent.click(editButton);

  //   // Verify toast is shown
  //   await waitFor(() =>
  //     expect(mockToast).toHaveBeenCalledWith({
  //       description: "Edit Project Failed",
  //     })
  //   );
  // });

  // it("should show error toast when deleteProject API fails", async () => {
  //   // Mock API failure
  //   vi.mocked(request.projects.deleteProject).mockRejectedValue(
  //     new Error("Delete Project Failed")
  //   );

  //   render(<OrganisationProjects />);

  //   // Trigger project deletion
  //   const deleteButton = screen.getByText("Delete Project");
  //   fireEvent.click(deleteButton);

  //   // Verify toast is shown
  //   await waitFor(() =>
  //     expect(mockToast).toHaveBeenCalledWith({
  //       description: "Delete Project Failed",
  //     })
  //   );
  // });
});
