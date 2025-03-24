import { request } from "@/api";
import { getOrganizationMembers } from "@/api/utils/organization";
import OrganisationMember from "@/components/OrganisationMember";
import { useToast } from "@/hooks/use-toast";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_ORGANIZATION_ROLE_ATOM,
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

vi.mock("@/api/utils/organization", () => ({
  getOrganizationMembers: vi.fn(),
}));

vi.mock("@/api", () => ({
  request: {
    organizations: {
      editOrganizationRoles: vi.fn(),
      editOrganizationMembers: vi.fn(),
    },
  },
}));

vi.mock("@/hooks/useOrgPermissions", () => ({
  useOrgPermissions: vi.fn(() => ({
    organizationMembersManage: true,
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

vi.mock("@/components/InviteMembersDialog", () => ({
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

describe("OrganisationMember Component", () => {
  const mockToast = vi.fn();
  const setMemberList = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === ORGANIZATION_MEMBER_ATOM) {
        return [
          [
            { id: "member-1", email: "member1@example.com", roleId: "role-1" },
            { id: "member-2", email: "member2@example.com", roleId: "role-2" },
          ],
          setMemberList,
        ] as any;
      }
      if (atom === CURRENT_ORGANIZATION_ATOM) {
        return ["organization-1"];
      }
      if (atom === CURRENT_ORGANIZATION_ROLE_ATOM) {
        return [
          [
            { id: "role-1", name: "Role_Admin" },
            { id: "role-2", name: "Role_User" },
          ],
        ];
      }
      return [null];
    });

    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });

    vi.mocked(getOrganizationMembers).mockResolvedValue([
      {
        id: "member-1",
        email: "member1@example.com",
        roleId: "role-1",
        userName: "",
      },
    ]);

    vi.mocked(request.organizations.editOrganizationRoles).mockResolvedValue(
      {},
    );
    vi.mocked(request.organizations.editOrganizationMembers).mockResolvedValue(
      {},
    );
  });

  it("should render DataTable with members data", () => {
    render(<OrganisationMember />);

    // Verify table rows
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
  });

  it("should call getOrganizationMembers API on mount", async () => {
    render(<OrganisationMember />);

    await waitFor(() => {
      expect(getOrganizationMembers).toHaveBeenCalledWith("organization-1");
    });

    expect(setMemberList).toHaveBeenCalledWith([
      {
        id: "member-1",
        email: "member1@example.com",
        roleId: "role-1",
        userName: "",
      },
    ]);
  });

  //   it("should call editOrganizationRoles API on role change", async () => {
  //     render(<OrganisationMember />);
  //     // Change role
  //     const roleSelect = screen.getByText("Role_Admin");
  //     fireEvent.change(roleSelect, { target: { value: "role-2" } });

  //     await waitFor(() => {
  //       expect(request.organizations.editOrganizationRoles).toHaveBeenCalledWith({
  //         query: "organization-1",
  //         data: { userId: "member-1", roleId: "role-2" },
  //       });
  //     });

  //     expect(mockToast).toHaveBeenCalledWith({
  //       description: "Successfully",
  //     });
  //   });

  //   it("should call editOrganizationMembers API on delete member", async () => {
  //     render(<OrganisationMember />);

  //     // Trigger Delete
  //     const deleteButton = screen.getAllByText("Delete Member")[0];
  //     fireEvent.click(deleteButton);

  //     await waitFor(() => {
  //       expect(
  //         request.organizations.editOrganizationMembers
  //       ).toHaveBeenCalledWith({
  //         query: "organization-1",
  //         data: { email: "member1@example.com", join: false, roleId: "role-1" },
  //       });
  //     });

  //     expect(mockToast).toHaveBeenCalledWith({
  //       description: "successfully removed",
  //     });

  //     expect(getOrganizationMembers).toHaveBeenCalled(); // Refresh member list
  //   });

  //   it("should call editOrganizationMembers API on invite member", async () => {
  //     render(<OrganisationMember />);

  //     // Trigger Invite Member
  //     const inviteButton = screen.getByText("Invite Member");
  //     fireEvent.click(inviteButton);

  //     await waitFor(() => {
  //       expect(
  //         request.organizations.editOrganizationMembers
  //       ).toHaveBeenCalledWith({
  //         query: "organization-1",
  //         data: { email: "test@example.com", join: true, roleId: "role-1" },
  //       });
  //     });

  //     expect(mockToast).toHaveBeenCalledWith({
  //       description: "successfully invited",
  //     });

  //     expect(getOrganizationMembers).toHaveBeenCalled(); // Refresh member list
  //   });

  //   it("should show error toast when editOrganizationRoles API fails", async () => {
  //     vi.mocked(request.organizations.editOrganizationRoles).mockRejectedValue(
  //       new Error("Role Update Failed")
  //     );

  //     render(<OrganisationMember />);

  //     // Change role
  //     const roleSelect = screen.getByText("Role_Admin");
  //     fireEvent.change(roleSelect, { target: { value: "role-2" } });

  //     await waitFor(() => {
  //       expect(mockToast).toHaveBeenCalledWith({
  //         description: "Role Update Failed",
  //       });
  //     });
  //   });

  //   it("should show error toast when editOrganizationMembers API fails", async () => {
  //     vi.mocked(request.organizations.editOrganizationMembers).mockRejectedValue(
  //       new Error("Invite Failed")
  //     );

  //     render(<OrganisationMember />);

  //     // Trigger Invite Member
  //     const inviteButton = screen.getByText("Invite Member");
  //     fireEvent.click(inviteButton);

  //     await waitFor(() => {
  //       expect(mockToast).toHaveBeenCalledWith({
  //         description: "Invite Failed",
  //       });
  //     });
  //   });
});
