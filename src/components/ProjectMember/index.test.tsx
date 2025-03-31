import { request } from "@/api";
import { getOrganizationMembers } from "@/api/utils/organization";
import { getProjectMembers } from "@/api/utils/project";
import ProjectMember from "@/components/ProjectMember";
import { useToast } from "@/hooks/use-toast";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_PROJECT_ATOM,
  CURRENT_PROJECT_ROLE_ATOM,
  ORGANIZATION_MEMBER_ATOM,
} from "@/state/atoms/organisation";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useAtom } from "jotai";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

vi.mock("@/api/utils/project", () => ({
  getProjectMembers: vi.fn(),
}));

vi.mock("@/api/utils/organization", () => ({
  getOrganizationMembers: vi.fn(),
}));

vi.mock("@/api", () => ({
  request: {
    projects: {
      editProjectRoles: vi.fn(),
      editProjectMembers: vi.fn(),
    },
  },
}));

vi.mock("@/hooks/useProjectPermissions", () => ({
  useProjectPermissions: vi.fn(() => ({
    projectsMembersManage: true,
  })),
}));

vi.mock("@/components/DataTable", () => ({
  __esModule: true,
  default: ({ data }: { data: any[] }) => (
    <table>
      <tbody>
        {data.map((row, idx) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <tr key={idx}>
            <td>{row.role}</td>
            <td>{row.operation}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

vi.mock("@/components/AddMembersDialog", () => ({
  __esModule: true,
  default: ({ onAddMember }: { onAddMember: any }) => (
    // biome-ignore lint/a11y/useButtonType: <explanation>
    <button
      onClick={() => onAddMember({ email: "test@example.com", role: "role-1" })}
    >
      Invite Member
    </button>
  ),
}));

vi.mock("@/components/DeleteDialog", () => ({
  __esModule: true,
  default: ({ onYes }: { onYes: any }) => (
    // biome-ignore lint/a11y/useButtonType: <explanation>
    <button onClick={onYes}>Delete Member</button>
  ),
}));

describe("ProjectMember Component", () => {
  const mockToast = vi.fn();
  const mockSetOrgMemberList = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_PROJECT_ATOM) return ["project-1"] as any;
      if (atom === CURRENT_ORGANIZATION_ATOM) return ["org-1"];
      if (atom === CURRENT_PROJECT_ROLE_ATOM) {
        return [
          [
            { id: "role-1", name: "Role_Admin" },
            { id: "role-2", name: "Role_User" },
          ],
        ];
      }
      if (atom === ORGANIZATION_MEMBER_ATOM) {
        return [
          [{ id: "org-member-1", roleId: "role-1" }],
          mockSetOrgMemberList,
        ];
      }
      return [null];
    });

    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });

    vi.mocked(getProjectMembers).mockResolvedValue([
      {
        id: "member-1",
        email: "member1@example.com",
        roleId: "role-1",
        userName: "",
      },
    ]);

    vi.mocked(getOrganizationMembers).mockResolvedValue([
      {
        id: "org-member-1",
        email: "org1@example.com",
        roleId: "role-1",
        userName: "",
        status: 0,
      },
    ]);

    vi.mocked(request.projects.editProjectRoles).mockResolvedValue({});
    vi.mocked(request.projects.editProjectMembers).mockResolvedValue({});
  });

  it("should render DataTable with project members data", async () => {
    render(<ProjectMember />);
    // Verify table rows

    // // Verify Invite Member button
    expect(screen.getByText("projects members")).toBeInTheDocument();
  });

  it("should call getProjectMembers API on mount", async () => {
    render(<ProjectMember />);

    await waitFor(() => {
      expect(getProjectMembers).toHaveBeenCalledWith("project-1");
    });

    expect(screen.getByText("Admin")).toBeInTheDocument(); // Member role
  });

  //   it("should call editProjectRoles API when role is updated", async () => {
  //     render(<ProjectMember />);

  //     // Trigger role change
  //     const roleSelect = screen.getByText("Admin");
  //     fireEvent.change(roleSelect, { target: { value: "role-2" } });

  //     await waitFor(() => {
  //       expect(request.projects.editProjectRoles).toHaveBeenCalledWith({
  //         query: "project-1",
  //         data: { userId: "member-1", roleId: "role-2" },
  //       });
  //     });
  //     screen.debug();

  //     expect(mockToast).toHaveBeenCalledWith({ description: "Successfully" });
  //   });

  //   it("should call editProjectMembers API on delete member", async () => {
  //     render(<ProjectMember />);

  //     // Trigger delete
  //     const deleteButton = screen.getByText("Delete Member");
  //     fireEvent.click(deleteButton);

  //     await waitFor(() => {
  //       expect(request.projects.editProjectMembers).toHaveBeenCalledWith({
  //         query: "project-1",
  //         data: { email: "member1@example.com", join: false, roleId: "role-1" },
  //       });
  //     });

  //     expect(mockToast).toHaveBeenCalledWith({
  //       description: "successfully removed",
  //     });
  //   });

  //   it("should call editProjectMembers API on invite member", async () => {
  //     render(<ProjectMember />);

  //     // Trigger invite member
  //     const inviteButton = screen.getByText("Invite Member");
  //     fireEvent.click(inviteButton);

  //     await waitFor(() => {
  //       expect(request.projects.editProjectMembers).toHaveBeenCalledWith({
  //         query: "project-1",
  //         data: { email: "test@example.com", join: true, roleId: "role-1" },
  //       });
  //     });

  //     expect(mockToast).toHaveBeenCalledWith({
  //       description: "successfully invited",
  //     });
  //   });

  //   it("should show error toast when editProjectRoles API fails", async () => {
  //     vi.mocked(request.projects.editProjectRoles).mockRejectedValue(
  //       new Error("Role Update Failed")
  //     );

  //     render(<ProjectMember />);

  //     // Trigger role change
  //     const roleSelect = screen.getByText("Role_Admin");
  //     fireEvent.change(roleSelect, { target: { value: "role-2" } });

  //     await waitFor(() => {
  //       expect(mockToast).toHaveBeenCalledWith({
  //         description: "Role Update Failed",
  //       });
  //     });
  //   });

  //   it("should show error toast when editProjectMembers API fails", async () => {
  //     vi.mocked(request.projects.editProjectMembers).mockRejectedValue(
  //       new Error("Edit Member Failed")
  //     );

  //     render(<ProjectMember />);

  //     // Trigger delete
  //     const deleteButton = screen.getByText("Delete Member");
  //     fireEvent.click(deleteButton);

  //     await waitFor(() => {
  //       expect(mockToast).toHaveBeenCalledWith({
  //         description: "Edit Member Failed",
  //       });
  //     });
  //   });
});
