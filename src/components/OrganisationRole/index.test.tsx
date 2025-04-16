import { request } from "@/api";
import { getOrganizationRoles } from "@/api/utils/organization";
import OrganisationRole from "@/components/OrganisationRole";
import { useToast } from "@/hooks/use-toast";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_ORGANIZATION_ROLE_ATOM,
} from "@/state/atoms/organisation";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useAtom } from "jotai";
import { beforeEach, describe, it, vi } from "vitest";

vi.mock("jotai", async () => {
  const actual = await vi.importActual("jotai");
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});

vi.mock("@/api/utils/organization", () => ({
  getOrganizationRoles: vi.fn(),
  getOrganizationRolesPermission: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));
vi.mock("@/api", () => ({
  request: {
    organizations: {
      deleteOrganization: vi.fn(),
      addOrganizationRoles: vi.fn(),
      setOrganizationRolePermissions: vi.fn(),
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

describe("OrganisationRole Component", () => {
  const mockToast = vi.fn();
  const mockSetRoles = vi.fn();
  const mockRoleList = [
    { id: "role-1", name: "organisationRole_admin" },
    { id: "role-2", name: "organisationRole_editor" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_ORGANIZATION_ATOM) {
        return ["organisation-123"] as any;
      }
      if (atom === CURRENT_ORGANIZATION_ROLE_ATOM) {
        return [mockRoleList, mockSetRoles];
      }
      return [null];
    });

    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });

    vi.mocked(getOrganizationRoles).mockResolvedValue(mockRoleList);

    vi.mocked(request.organizations.deleteOrganization).mockResolvedValue({});
    vi.mocked(request.organizations.addOrganizationRoles).mockResolvedValue({});
  });

  it("should render CreateRoleDialog and DataTable", () => {
    render(<OrganisationRole />);
    expect(screen.getByText("Create Role")).toBeInTheDocument();

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    expect(screen.getByText("role")).toBeInTheDocument();
  });

  it("should fetch roles on initial load", async () => {
    render(<OrganisationRole />);

    await waitFor(() => {
      expect(getOrganizationRoles).toHaveBeenCalledWith("organisation-123");
      expect(mockSetRoles).toHaveBeenCalledWith(mockRoleList);
    });
  });

  it("should handle role creation", async () => {
    render(<OrganisationRole />);

    const createButton = screen.getByText("Create Role");
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(request.organizations.addOrganizationRoles).toHaveBeenCalledWith({
        query: "organisation-123",
        data: { name: "Test Role" },
      });
    });

    expect(getOrganizationRoles).toHaveBeenCalled();
  });
});
