import { request } from "@/api";
import { getProjectRoles } from "@/api/utils/project";
import ProjectRole from "@/components/ProjectRole";
import { useToast } from "@/hooks/use-toast";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import {
  CURRENT_PROJECT_ATOM,
  CURRENT_PROJECT_ROLE_ATOM,
} from "@/state/atoms/organisation";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useAtom } from "jotai";
import { beforeEach, describe, it, vi } from "vitest";

vi.mock("jotai", async () => {
  const actual = await vi.importActual("jotai");
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});

vi.mock("@/api/utils/project", () => ({
  getProjectRoles: vi.fn(),
  getProjectRolesPermission: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

vi.mock("@/hooks/useProjectPermissions", () => ({
  useProjectPermissions: vi.fn(),
}));

vi.mock("@/api", () => ({
  request: {
    projects: {
      deleteProjectRoles: vi.fn(),
      addProjectRoles: vi.fn(),
      setProjectRolePermissions: vi.fn(),
    },
  },
}));

vi.mock("@/components/CreateRoleDialog", () => ({
  __esModule: true,
  default: ({ onCreate }: { onCreate: any }) => (
    // biome-ignore lint/a11y/useButtonType: <explanation>
    <button onClick={() => onCreate({ roleName: "Test Role" })}>
      Create Role
    </button>
  ),
}));

vi.mock("@/components/DeleteDialog", () => ({
  __esModule: true,
  default: ({ onYes }: { onYes: any }) => (
    // biome-ignore lint/a11y/useButtonType: <explanation>
    <button onClick={onYes}>Delete Role</button>
  ),
}));

describe("ProjectRole Component", () => {
  const mockToast = vi.fn();
  const mockSetRoles = vi.fn();
  const mockRoleList = [
    { id: "role-1", name: "project_admin" },
    { id: "role-2", name: "project_editor" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_PROJECT_ATOM) {
        return ["project-123"] as any;
      }
      if (atom === CURRENT_PROJECT_ROLE_ATOM) {
        return [mockRoleList, mockSetRoles];
      }
      return [null];
    });

    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });

    vi.mocked(useProjectPermissions).mockReturnValue({
      roleCreate: true,
      roleEdit: true,
      projectsEdit: true,
    });

    vi.mocked(getProjectRoles).mockResolvedValue(mockRoleList);

    vi.mocked(request.projects.deleteProjectRoles).mockResolvedValue({});
    vi.mocked(request.projects.addProjectRoles).mockResolvedValue({});
  });

  it("should render CreateRoleDialog and DataTable", async () => {
    await act(async () => {
      render(<ProjectRole />);
    });

    expect(screen.getByText("Create Role")).toBeInTheDocument();

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    expect(screen.getByText("role")).toBeInTheDocument();
    expect(screen.getByText("project role")).toBeInTheDocument();
  });

  it("should fetch roles on initial load", async () => {
    await act(async () => {
      render(<ProjectRole />);
    });

    await waitFor(() => {
      expect(getProjectRoles).toHaveBeenCalledWith("project-123");
      expect(mockSetRoles).toHaveBeenCalledWith(mockRoleList);
    });
  });

  it("should handle role creation", async () => {
    await act(async () => {
      render(<ProjectRole />);
    });

    const createButton = screen.getByText("Create Role");
    await act(async () => {
      fireEvent.click(createButton);
    });

    await waitFor(() => {
      expect(request.projects.addProjectRoles).toHaveBeenCalledWith({
        query: "project-123",
        data: { name: "Test Role" },
      });
    });

    expect(getProjectRoles).toHaveBeenCalled();
  });

  it("should handle role deletion", async () => {
    await act(async () => {
      render(<ProjectRole />);
    });

    const deleteButton = screen.getAllByText("Delete Role")[0];
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(request.projects.deleteProjectRoles).toHaveBeenCalledWith({
        query: "project-123/roles/role-1",
      });
    });

    expect(mockToast).toHaveBeenCalledWith({
      description: "Successfully deleted",
    });

    expect(getProjectRoles).toHaveBeenCalled();
  });

  it("should not show delete button for owner role", async () => {
    const ownerRole = [{ id: "role-1", name: "project_owner" }];
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_PROJECT_ROLE_ATOM) {
        return [ownerRole, mockSetRoles] as any;
      }
      return [null];
    });

    await act(async () => {
      render(<ProjectRole />);
    });

    expect(screen.queryByText("Delete Role")).not.toBeInTheDocument();
  });

  it("should show error toast when API call fails", async () => {
    vi.mocked(request.projects.deleteProjectRoles).mockRejectedValueOnce(
      new Error("Delete Failed"),
    );

    await act(async () => {
      render(<ProjectRole />);
    });

    const deleteButton = screen.getAllByText("Delete Role")[0];
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        description: "Delete Failed",
      });
    });
  });
});
