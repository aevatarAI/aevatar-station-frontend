import { getOrganizationRoles } from "@/api/utils/organization";
import { getProjectRoles } from "@/api/utils/project";
import { useSideBarParams } from "@/hooks/useSideBarParams";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_ORGANIZATION_ROLE_ATOM,
  CURRENT_PROJECT_ATOM,
  CURRENT_PROJECT_ROLE_ATOM,
} from "@/state/atoms/organisation";
import { render, screen, waitFor } from "@testing-library/react";
import { useAtom } from "jotai";
import { afterEach, describe, expect, it, vi } from "vitest";
import Profile from "../Profile"; // Ensure correct file path

vi.mock("jotai", () => ({
  useAtom: vi.fn(),
}));

vi.mock("@/hooks/useSideBarParams", () => ({
  useSideBarParams: vi.fn(),
}));

vi.mock("@/api/utils/organization", () => ({
  getOrganizationRoles: vi.fn(),
}));

vi.mock("@/api/utils/project", () => ({
  getProjectRoles: vi.fn(),
}));

vi.mock("@/components/SideBar", () => ({
  SideBar: () => <div>Mocked SideBar</div>,
}));

vi.mock("@/components/ProfileInner", () => ({
  __esModule: true,
  default: ({ tab }: { tab: string }) => <div>ProfileInner Tab: {tab}</div>,
}));

vi.mock("@/components/OrganisationInner", () => ({
  __esModule: true,
  default: ({ tab }: { tab: string }) => (
    <div>OrganisationInner Tab: {tab}</div>
  ),
}));

vi.mock("@/components/ProjectsInner", () => ({
  __esModule: true,
  default: ({ tab }: { tab: string }) => <div>ProjectsInner Tab: {tab}</div>,
}));

describe("Profile Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render sidebar and default layout", () => {
    const mockSideBarParams = vi.fn().mockReturnValue(["profile", "settings"]);
    vi.mocked(useSideBarParams).mockImplementation(mockSideBarParams);

    render(<Profile />);

    // Check Sidebar
    expect(screen.getByText("Mocked SideBar")).toBeInTheDocument();

    // Check Initial Default Content
    expect(screen.getByText("ProfileInner Tab: settings")).toBeInTheDocument();
  });

  it("should call getOrganizationRoles when currentOrganisationId is updated", async () => {
    const mockSetOrganisationRoles = vi.fn();
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_ORGANIZATION_ATOM)
        return ["org-id-123", vi.fn()] as any;
      if (atom === CURRENT_ORGANIZATION_ROLE_ATOM)
        return [null, mockSetOrganisationRoles];
      return [null, vi.fn()];
    });

    render(<Profile />);

    await waitFor(() => {
      expect(getOrganizationRoles).toHaveBeenCalledWith("org-id-123");
    });

    // Ensure it sets roles correctly
    expect(mockSetOrganisationRoles).toHaveBeenCalled();
  });

  it("should call getProjectRoles when projectId is updated", async () => {
    const mockSetProjectRoles = vi.fn();
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_PROJECT_ATOM)
        return ["project-id-456", vi.fn()] as any;
      if (atom === CURRENT_PROJECT_ROLE_ATOM)
        return [null, mockSetProjectRoles];
      return [null, vi.fn()];
    });

    render(<Profile />);

    await waitFor(() => {
      expect(getProjectRoles).toHaveBeenCalledWith("project-id-456");
    });

    // Ensure it sets roles correctly
    expect(mockSetProjectRoles).toHaveBeenCalled();
  });

  it("should render OrganisationInner when `selectMenu` is 'organisation'", () => {
    const mockSideBarParams = vi.fn().mockReturnValue(["organisation", "tab1"]);
    vi.mocked(useSideBarParams).mockImplementation(mockSideBarParams);

    render(<Profile />);

    expect(screen.getByText("OrganisationInner Tab: tab1")).toBeInTheDocument();
  });

  it("should render ProjectsInner when `selectMenu` is 'projects'", () => {
    const mockSideBarParams = vi.fn().mockReturnValue(["projects", "tab2"]);
    vi.mocked(useSideBarParams).mockImplementation(mockSideBarParams);

    render(<Profile />);

    expect(screen.getByText("ProjectsInner Tab: tab2")).toBeInTheDocument();
  });
});
