import { request } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { useOrgPermissions } from "@/hooks/useOrgPermissions";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_ORGANIZATION_ROLE_ATOM,
} from "@/state/atoms/organisation";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useAtom } from "jotai";
import { Provider } from "jotai";
import { beforeEach, describe, expect, it, vi } from "vitest";
import OrganisationRole from "../index";

// Mock all external dependencies
vi.mock("jotai/utils", () => ({
  atomWithStorage: (key: string, initialValue: any) => ({
    init: initialValue,
    toString: () => key,
  }),
}));

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

vi.mock("@/hooks/useOrgPermissions", () => ({
  useOrgPermissions: vi.fn(),
}));

vi.mock("@/api", () => ({
  request: {
    organizations: {
      getOrganizationRoles: vi.fn(),
      addOrganizationRoles: vi.fn(),
      deleteOrganizationRoles: vi.fn(),
      setOrganizationRolePermissions: vi.fn(),
    },
  },
  getOrganizationRoles: vi.fn(),
}));

// Mock SVG imports
vi.mock("@/assets/delete_action.svg?react", () => ({
  default: () => <div data-testid="delete-icon">Delete Icon</div>,
}));

vi.mock("@/assets/tip_icon.svg?react", () => ({
  default: () => <div>Tip Icon</div>,
}));

// Mock DataTable component
vi.mock("@/components/DataTable", () => ({
  default: ({ data }: { data: any[] }) => (
    <div data-testid="mock-table">
      {data?.map((item: any) => (
        <div key={item.id} data-testid={`role-${item.id}`}>
          {item.name}
          {item.organisationRole}
          {item.operation}
        </div>
      ))}
    </div>
  ),
}));

// Mock other components
vi.mock("@/components/CreateRoleDialog", () => ({
  default: ({ onCreate }: { onCreate: (values: any) => void }) => (
    <button
      type="button"
      data-testid="create-role-button"
      onClick={() => onCreate({ roleName: "New Role" })}
    >
      Create Role
    </button>
  ),
}));

vi.mock("@/components/DeleteDialog", () => ({
  default: ({ onYes }: { onYes: () => void }) => (
    <div>
      <button type="button" data-testid="delete-button" onClick={onYes}>
        Delete
      </button>
    </div>
  ),
}));

vi.mock("@/components/PermissionManagerDialog", () => ({
  default: ({ onSave }: { onSave: (values: any) => void }) => (
    <div>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button data-testid="permissions-button" onClick={() => onSave([])}>
        Permissions
      </button>
    </div>
  ),
}));

vi.mock("@/components/OrganisationRole/columns", () => ({
  columns: [],
}));

const renderWithProvider = (component: React.ReactNode) => {
  return render(<Provider>{component}</Provider>);
};

describe("OrganisationRole", () => {
  const mockToast = {
    toast: vi.fn(),
  };

  const mockUserPermissions = {
    roleCreate: true,
    roleDelete: true,
    roleEdit: true,
  };

  const mockRoleList = [
    {
      id: "1",
      name: "R_OWNER",
    },
    {
      id: "2",
      name: "R_CUSTOM",
    },
  ];

  const mockSetRoleList = vi.fn();
  const mockSetCurrentOrg = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as any).mockReturnValue(mockToast);
    (useOrgPermissions as any).mockReturnValue(mockUserPermissions);
    (useAtom as any).mockImplementation((atom: any) => {
      if (atom.toString() === "current_organization_atom") {
        return ["org-123", mockSetCurrentOrg];
      }
      if (atom.toString() === "current_organization_roles_atom") {
        return [mockRoleList, mockSetRoleList];
      }
      return [[], vi.fn()];
    });
    (request.organizations.getOrganizationRoles as any).mockResolvedValue(
      mockRoleList,
    );
  });

  it("should render organisation roles list", async () => {
    renderWithProvider(<OrganisationRole />);

    await waitFor(() => {
      expect(screen.getByText("Organisation roles")).toBeInTheDocument();
      expect(screen.getByTestId("mock-table")).toBeInTheDocument();
      expect(screen.getByTestId("role-1")).toBeInTheDocument();
      expect(screen.getByTestId("role-2")).toBeInTheDocument();
    });
  });

  it("should handle role creation", async () => {
    const mockCreateRole = vi.fn().mockResolvedValue({});
    (request.organizations.addOrganizationRoles as any).mockImplementation(
      mockCreateRole,
    );

    renderWithProvider(<OrganisationRole />);

    const createButton = screen.getByTestId("create-role-button");
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockCreateRole).toHaveBeenCalledWith({
        query: "org-123",
        data: {
          name: "New Role",
        },
      });
    });
  });

  it("should handle role creation error", async () => {
    const mockError = new Error("Create role error");
    (request.organizations.addOrganizationRoles as any).mockRejectedValue(
      mockError,
    );

    renderWithProvider(<OrganisationRole />);

    const createButton = screen.getByTestId("create-role-button");
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith({
        description: expect.stringContaining("Create role error"),
      });
    });
  });

  it("should handle role deletion", async () => {
    const mockDeleteRole = vi.fn().mockResolvedValue({});
    (request.organizations.deleteOrganizationRoles as any).mockImplementation(
      mockDeleteRole,
    );

    renderWithProvider(<OrganisationRole />);

    await waitFor(() => {
      const deleteButton = screen.getByTestId("delete-button");
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(mockDeleteRole).toHaveBeenCalledWith({
        query: "org-123/roles/2",
      });
      expect(mockToast.toast).toHaveBeenCalledWith({
        description: "Successfully deleted",
      });
    });
  });

  it("should handle role deletion error", async () => {
    const mockError = new Error("Delete role error");
    (request.organizations.deleteOrganizationRoles as any).mockRejectedValue(
      mockError,
    );

    renderWithProvider(<OrganisationRole />);

    await waitFor(() => {
      const deleteButton = screen.getByTestId("delete-button");
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith({
        description: expect.stringContaining("Delete role error"),
      });
    });
  });

  it("should handle permission updates", async () => {
    const mockUpdatePermissions = vi.fn().mockResolvedValue({});
    (
      request.organizations.setOrganizationRolePermissions as any
    ).mockImplementation(mockUpdatePermissions);

    renderWithProvider(<OrganisationRole />);

    await waitFor(() => {
      const permissionButton = screen.getByTestId("permissions-button");
      fireEvent.click(permissionButton);
    });

    await waitFor(() => {
      expect(mockUpdatePermissions).toHaveBeenCalledWith({
        query: "org-123",
        params: {
          providerName: "R",
          providerKey: "R_CUSTOM",
        },
        data: {
          permissions: [],
        },
      });
    });
  });

  it("should handle API errors gracefully", async () => {
    const mockError = new Error("API Error");
    (request.organizations.getOrganizationRoles as any).mockRejectedValue(
      mockError,
    );

    renderWithProvider(<OrganisationRole />);

    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith({
        description: expect.stringContaining("API Error"),
      });
    });
  });

  it("should not show create button when user lacks permissions", async () => {
    (useOrgPermissions as any).mockReturnValue({
      ...mockUserPermissions,
      roleCreate: false,
    });

    renderWithProvider(<OrganisationRole />);

    await waitFor(() => {
      expect(
        screen.queryByTestId("create-role-button"),
      ).not.toBeInTheDocument();
    });
  });

  it("should not show delete button for owner role", async () => {
    renderWithProvider(<OrganisationRole />);

    await waitFor(() => {
      const deleteButtons = screen.getAllByTestId("delete-button");
      expect(deleteButtons).toHaveLength(1); // Only one delete button for non-owner role
    });
  });

  it("should not fetch roles when no organization is selected", async () => {
    (useAtom as any).mockImplementation((atom: any) => {
      if (atom.toString() === "current_organization_atom") {
        return [null, mockSetCurrentOrg];
      }
      if (atom.toString() === "current_organization_roles_atom") {
        return [mockRoleList, mockSetRoleList];
      }
      return [[], vi.fn()];
    });

    renderWithProvider(<OrganisationRole />);

    await waitFor(() => {
      expect(request.organizations.getOrganizationRoles).not.toHaveBeenCalled();
    });
  });

  it("should handle permission updates when no organization is selected", async () => {
    (useAtom as any).mockImplementation((atom: any) => {
      if (atom.toString() === "current_organization_atom") {
        return [null, mockSetCurrentOrg];
      }
      if (atom.toString() === "current_organization_roles_atom") {
        return [mockRoleList, mockSetRoleList];
      }
      return [[], vi.fn()];
    });

    renderWithProvider(<OrganisationRole />);

    await waitFor(() => {
      const permissionButton = screen.getByTestId("permissions-button");
      fireEvent.click(permissionButton);
    });

    // Should not call the API
    expect(
      request.organizations.setOrganizationRolePermissions,
    ).not.toHaveBeenCalled();
  });
});
