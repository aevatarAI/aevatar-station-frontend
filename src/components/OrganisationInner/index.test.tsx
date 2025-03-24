import { request } from "@/api";
import OrganisationInner from "@/components/OrganisationInner";
import { useToast } from "@/hooks/use-toast";
import { useUpdateOrganisationsHandler } from "@/hooks/useUpdateOrganisations";
import {
  CURRENT_ORGANIZATION_ATOM,
  ORGANIZATIONS_LIST_ATOM,
} from "@/state/atoms/organisation";
import { handleErrorMessage } from "@/utils/error";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useAtom } from "jotai";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("OrganisationInner Component", () => {
  const mockToast = vi.fn();
  const mockUpdateOrganizationList = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mock("jotai", async () => {
      const actual = await vi.importActual("jotai");
      return { ...actual, useAtom: vi.fn() };
    });

    vi.mock("@/hooks/use-toast", () => ({
      useToast: vi.fn(),
    }));

    vi.mock("@/api", () => ({
      request: {
        organizations: {
          editOrganization: vi.fn(),
        },
      },
    }));

    vi.mock("@/hooks/useUpdateOrganisations", () => ({
      useUpdateOrganisationsHandler: vi.fn(),
      useUpdateProjectHandler: vi.fn(),
    }));

    vi.mock("@/components/OrganisationProjects", () => ({
      __esModule: true,
      default: () => <div>OrganisationProjects Component</div>,
    }));

    vi.mock("@/components/OrganisationMember", () => ({
      __esModule: true,
      default: () => <div>OrganisationMember Component</div>,
    }));

    vi.mock("@/components/OrganisationRole", () => ({
      __esModule: true,
      default: () => <div>OrganisationRole Component</div>,
    }));
    vi.mock("@/components/General", () => ({
      __esModule: true,
      default: () => (
        <div>
          <input placeholder="organisation name" data-testid="general-input" />
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button>save</button>
        </div>
      ),
    }));

    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_ORGANIZATION_ATOM) {
        return ["mock-organisation-id"] as any;
      }
      if (atom === ORGANIZATIONS_LIST_ATOM) {
        return [
          [
            {
              id: "mock-organisation-id",
              displayName: "Mock Organisation",
            },
            {
              id: "other-organisation-id",
              displayName: "Other Organisation",
            },
          ],
        ];
      }
      return [null];
    });

    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: () => {},
      toasts: [],
    });

    vi.mocked(useUpdateOrganisationsHandler).mockReturnValue(
      mockUpdateOrganizationList,
    );

    vi.mocked(request.organizations.editOrganization).mockResolvedValue({});
  });

  it("should render General component when tab is 'general'", () => {
    render(<OrganisationInner tab="general" />);
    // Check if General component is rendered
    expect(screen.getByTestId("general-input")).toBeInTheDocument();
    expect(screen.getByText("save")).toBeInTheDocument();
  });

  it("should render OrganisationProjects component when tab is 'project'", () => {
    render(<OrganisationInner tab="project" />);
    // Check if OrganisationProjects component is rendered
    expect(
      screen.getByText("OrganisationProjects Component"),
    ).toBeInTheDocument();
  });

  it("should render OrganisationMember component when tab is 'member'", () => {
    render(<OrganisationInner tab="member" />);

    // Check if OrganisationMember component is rendered
    expect(
      screen.getByText("OrganisationMember Component"),
    ).toBeInTheDocument();
  });

  it("should render OrganisationRole component when tab is 'role'", () => {
    render(<OrganisationInner tab="role" />);

    // Check if OrganisationRole component is rendered
    expect(screen.getByText("OrganisationRole Component")).toBeInTheDocument();
  });

  //   it("should successfully save organisation name and show success toast", async () => {
  //     render(<OrganisationInner tab="general" />);

  //     // Trigger Save button
  //     const saveButton = screen.getByText("save");
  //     fireEvent.click(saveButton);

  //     // Verify API call
  //     await waitFor(() => {
  //       expect(request.organizations.editOrganization).toHaveBeenCalledWith({
  //         query: "mock-organisation-id",
  //         data: { displayName: "mocked-organisation-name" },
  //       });
  //     });

  //     // Verify success toast
  //     await waitFor(() => {
  //       expect(mockToast).toHaveBeenCalledWith({
  //         description: "Successfully",
  //       });
  //     });

  //     // Verify organisation list update function was called
  //     await waitFor(() => {
  //       expect(mockUpdateOrganizationList).toHaveBeenCalled();
  //     });
  //   });

  //   it("should show error toast when saving organisation name fails", async () => {
  //     // Mock API throwing an error
  //     vi.mocked(request.organizations.editOrganization).mockRejectedValue(
  //       new Error("Save failed")
  //     );

  //     render(<OrganisationInner tab="general" />);

  //     // Trigger Save button
  //     const saveButton = screen.getByText("Save");
  //     fireEvent.click(saveButton);

  //     // Verify API call
  //     await waitFor(() => {
  //       expect(request.organizations.editOrganization).toHaveBeenCalledWith({
  //         query: "mock-organisation-id",
  //         data: { displayName: "mocked-organisation-name" },
  //       });
  //     });

  //     // Verify error toast
  //     await waitFor(() => {
  //       expect(mockToast).toHaveBeenCalledWith({
  //         description: "Error: save name",
  //       });
  //     });
  //   });

  //   it("should update General input when curOrg.displayName updates", () => {
  //     vi.mocked(useAtom).mockImplementation((atom) => {
  //       if (atom === CURRENT_ORGANIZATION_ATOM)
  //         return ["mock-organisation-id"] as any;
  //       if (atom === ORGANIZATIONS_LIST_ATOM) {
  //         return [
  //           [
  //             {
  //               id: "mock-organisation-id",
  //               displayName: "Updated Organisation Name",
  //             },
  //           ],
  //         ];
  //       }
  //       return [null];
  //     });

  //     render(<OrganisationInner tab="general" />);

  //     // Verify updated input value
  //     expect(
  //       screen.getByPlaceholderText("Updated Organisation Name")
  //     ).toBeInTheDocument();
  //   });
});
