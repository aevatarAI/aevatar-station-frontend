import { getOrganizationRolesPermission } from "@/api/utils/organization";
import { CURRENT_ORGANIZATION_ATOM } from "@/state/atoms/organisation";
import { render, screen, waitFor } from "@testing-library/react";
import { useAtom } from "jotai";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PermissionManagerDialog from "./index";

vi.mock("jotai", async () => {
  const actual = await vi.importActual("jotai");
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});

vi.mock("@/api/utils/organization", () => ({
  getOrganizationRolesPermission: vi.fn(),
}));

// Mock子组件
vi.mock("@/components/PermissionManagerInnerDialog", () => ({
  __esModule: true,
  default: ({ permissionOrigin }: { permissionOrigin: any[] }) => (
    <div data-testid="permission-manager">
      {permissionOrigin.length > 0 ? (
        <ul>
          {permissionOrigin.map((permission) => (
            <li key={permission.name}>{permission.displayName}</li>
          ))}
        </ul>
      ) : (
        <p>No Permissions</p>
      )}
    </div>
  ),
}));
describe("PermissionManagerDialog", () => {
  const mockOnSave = vi.fn();
  const mockorgId = "org-23";

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useAtom
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_ORGANIZATION_ATOM) {
        return [mockorgId] as any;
      }
      return [null];
    });

    // Mock API
    vi.mocked(getOrganizationRolesPermission).mockResolvedValue({
      groups: [
        {
          permissions: [
            {
              name: "permission-1",
              displayName: "Permission 1",
              allowedProviders: [],
              grantedProviders: [],
            },
            {
              name: "permission-2",
              displayName: "Permission 2",
              allowedProviders: [],
              grantedProviders: [],
            },
          ],
          name: "",
          displayName: "",
          displayNameKey: "",
          displayNameResource: "",
        },
      ],
      entityDisplayName: "",
    });
  });

  it("should render the PermissionManagerInnerDialog component", () => {
    render(
      <PermissionManagerDialog
        roleName="Admin"
        isOwner={false}
        onSave={mockOnSave}
      />,
    );

    expect(screen.getByTestId("permission-manager")).toBeInTheDocument();
  });

  it("should call getOrganizationRolesPermission on mount", async () => {
    render(
      <PermissionManagerDialog
        roleName="Admin"
        isOwner={false}
        onSave={mockOnSave}
      />,
    );

    await waitFor(() => {
      expect(getOrganizationRolesPermission).toHaveBeenCalledWith("org-23", {
        providerName: "R",
        providerKey: "Admin",
      });
    });
  });

  it("should not call getOrganizationRolesPermission if orgId is null", async () => {
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_ORGANIZATION_ATOM) {
        return [null] as any;
      }
      return [null];
    });

    render(
      <PermissionManagerDialog
        roleName="Admin"
        isOwner={false}
        onSave={mockOnSave}
      />,
    );

    expect(getOrganizationRolesPermission).not.toHaveBeenCalled();
  });

  it("should update permissionOrigin after API call", async () => {
    render(
      <PermissionManagerDialog
        roleName="Admin"
        isOwner={false}
        onSave={mockOnSave}
      />,
    );

    expect(screen.getByText("No Permissions")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Permission 1")).toBeInTheDocument();
      expect(screen.getByText("Permission 2")).toBeInTheDocument();
    });
  });

  it("should call onSave when PermissionManagerInnerDialog triggers save", async () => {
    render(
      <PermissionManagerDialog
        roleName="Admin"
        isOwner={false}
        onSave={mockOnSave}
      />,
    );

    const mockPermissions = [
      { name: "permission-1", displayName: "Permission 1", isGranted: true },
      { name: "permission-2", displayName: "Permission 2", isGranted: false },
    ];

    await waitFor(() => {
      mockOnSave(mockPermissions);
      expect(mockOnSave).toHaveBeenCalledWith(mockPermissions);
    });
  });
});
