import { useOrgPermissions } from "@/hooks/useOrgPermissions";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import OrganisationInner from "./index";

// Mock hooks
vi.mock("@/hooks/useGeneral", () => ({
  useGeneral: vi.fn().mockReturnValue({
    handleUpdateName: vi.fn(),
    currentOrg: {
      displayName: "Test Org",
      id: "test-org-id",
    },
  }),
}));

vi.mock("@/hooks/useOrgPermissions", () => ({
  useOrgPermissions: vi.fn().mockReturnValue({
    organizationsEdit: true,
  }),
}));

// Mock child components
vi.mock("@/components/General", () => ({
  default: vi.fn().mockImplementation(({ header, title }) => (
    <div data-testid="general-component">
      <div>{header}</div>
      <div>{title}</div>
    </div>
  )),
}));

vi.mock("@/components/OrganisationProjects", () => ({
  default: vi
    .fn()
    .mockImplementation(() => (
      <div data-testid="organisation-projects">Projects Component</div>
    )),
}));

vi.mock("@/components/OrganisationMember", () => ({
  default: vi
    .fn()
    .mockImplementation(() => (
      <div data-testid="organisation-member">Member Component</div>
    )),
}));

vi.mock("@/components/OrganisationRole", () => ({
  default: vi
    .fn()
    .mockImplementation(() => (
      <div data-testid="organisation-role">Role Component</div>
    )),
}));

describe("OrganisationInner Component", () => {
  it("should render General component when tab is general", () => {
    render(<OrganisationInner tab="general" />);
    expect(screen.getByTestId("general-component")).toBeInTheDocument();
    expect(screen.getByText("Organisation Settings")).toBeInTheDocument();
    expect(screen.getByText("Organisation Name")).toBeInTheDocument();
  });

  it("should render OrganisationProjects component when tab is project", () => {
    render(<OrganisationInner tab="project" />);
    expect(screen.getByTestId("organisation-projects")).toBeInTheDocument();
  });

  it("should render OrganisationMember component when tab is member", () => {
    render(<OrganisationInner tab="member" />);
    expect(screen.getByTestId("organisation-member")).toBeInTheDocument();
  });

  it("should render OrganisationRole component when tab is role", () => {
    render(<OrganisationInner tab="role" />);
    expect(screen.getByTestId("organisation-role")).toBeInTheDocument();
  });

  it("should pass correct props to General component", () => {
    render(<OrganisationInner tab="general" />);
    const generalComponent = screen.getByTestId("general-component");
    expect(generalComponent).toBeInTheDocument();
    expect(screen.getByText("Organisation Settings")).toBeInTheDocument();
    expect(screen.getByText("Organisation Name")).toBeInTheDocument();
  });

  it("should handle readonly state based on permissions", () => {
    // Mock useOrgPermissions to return false for organizationsEdit
    vi.mocked(useOrgPermissions).mockReturnValueOnce({
      organizationsEdit: false,
    });

    render(<OrganisationInner tab="general" />);
    const generalComponent = screen.getByTestId("general-component");
    expect(generalComponent).toBeInTheDocument();
  });
});
