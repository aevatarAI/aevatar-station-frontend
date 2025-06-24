import { request } from "@/api";
import ProjectsInner from "@/components/ProjectsInner";
import { useToast } from "@/hooks/use-toast";
import { useUpdateProjectHandler } from "@/hooks/useUpdateOrganisations";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_PROJECT_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import { handleErrorMessage } from "@/utils/error";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useAtom } from "jotai";
import React from "react";
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

vi.mock("@/api", () => ({
  request: {
    projects: {
      editProject: vi.fn(),
    },
  },
}));

vi.mock("@/hooks/useUpdateOrganisations", () => ({
  useUpdateProjectHandler: vi.fn(),
}));

vi.mock("@/components/General", () => ({
  __esModule: true,
  default: ({
    onConfirm,
    extraInput,
  }: {
    onConfirm: (value: string) => void;
    extraInput: JSX.Element;
  }) => (
    <div>
      {extraInput}
      <input placeholder="project name" data-testid="general-input" />
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button onClick={() => onConfirm("mocked-project-name")}>Save</button>
    </div>
  ),
}));

vi.mock("@/components/ProjectMember", () => ({
  __esModule: true,
  default: () => <div>ProjectMember Component</div>,
}));

vi.mock("@/components/ProjectRole", () => ({
  __esModule: true,
  default: () => <div>ProjectRole Component</div>,
}));

describe("ProjectsInner Component", () => {
  const mockToast = vi.fn();
  const mockUpdateProjectList = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useAtom
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_PROJECT_ATOM) return ["mock-project-id"] as any;
      if (atom === PROJECT_LIST_ATOM) {
        return [
          [
            {
              id: "mock-project-id",
              displayName: "Mock Project",
              domainName: "mock.com",
            },
          ],
        ];
      }
      if (atom === CURRENT_ORGANIZATION_ATOM) return ["mock-organization-id"];
      return [null];
    });

    // Mock hooks
    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });
    vi.mocked(useUpdateProjectHandler).mockReturnValue(mockUpdateProjectList);
    vi.mocked(request.projects.editProject).mockResolvedValue({});
  });

  it("should render General component with extraInput when tab is 'general'", () => {
    render(<ProjectsInner tab="general" />);

    // Check if General component is rendered
    expect(screen.getByTestId("general-input")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();

    // Verify extraInput (domain name input) is rendered
    expect(screen.getByText("domain name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("mock.com")).toBeInTheDocument();
  });

  it("should render ProjectMember component when tab is 'member'", () => {
    render(<ProjectsInner tab="member" />);

    // Check if ProjectMember component is rendered
    expect(screen.getByText("ProjectMember Component")).toBeInTheDocument();
  });

  it("should render ProjectRole component when tab is 'role'", () => {
    render(<ProjectsInner tab="role" />);

    // Check if ProjectRole component is rendered
    expect(screen.getByText("ProjectRole Component")).toBeInTheDocument();
  });

  it("should update domain name input and submit successfully", async () => {
    render(<ProjectsInner tab="general" />);

    // Update domain name input
    const domainInput = screen.getByPlaceholderText("mock.com");
    fireEvent.change(domainInput, { target: { value: "new-domain.com" } });

    // Verify input value is updated
    expect(domainInput).toHaveValue("new-domain.com");

    // Trigger Save button click
    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    // Verify API call
    await waitFor(() => {
      expect(request.projects.editProject).toHaveBeenCalledWith({
        query: "mock-project-id",
        data: {
          displayName: "mocked-project-name",
        },
      });
    });

    // Verify success toast is shown
    expect(mockToast).toHaveBeenCalledWith({
      description: "successfully saved",
    });

    // Verify project list update
    expect(mockUpdateProjectList).toHaveBeenCalledWith("mock-organization-id");
  });

  it("should show error toast when editProject API fails", async () => {
    // Mock editProject call to reject
    vi.mocked(request.projects.editProject).mockRejectedValue(
      new Error("Edit Project Failed"),
    );

    render(<ProjectsInner tab="general" />);

    // Trigger Save button click
    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    // Verify API call
    await waitFor(() => {
      expect(request.projects.editProject).toHaveBeenCalledTimes(1);
    });

    // Verify error toast is shown
    expect(mockToast).toHaveBeenCalledWith({
      description: "Edit Project Failed",
    });
  });
});
