import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Redirection from "./index";

// Mock the API functions
vi.mock("@/api/utils/organization", () => ({
  getProjectList: vi.fn(),
}));

vi.mock("@/api/utils/project", () => ({
  getRecentUsed: vi.fn(),
}));

const mockGetProjects = vi.hoisted(() => vi.fn());
vi.mock("@/hooks/useGetProjects", () => ({
  getProjects: mockGetProjects,
}));

// Mock the hooks
const mockNavigate = vi.fn();
const mockTo = vi.fn();
const mockSetCurrentProject = vi.fn();
const mockCreateDefaultProject = vi.fn();

vi.mock("@/hooks/navigate", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/hooks/useCreateDefaultProject", () => ({
  useCreateDefaultProject: () => mockCreateDefaultProject,
}));

vi.mock("@/hooks/useGetOrganizations", () => ({
  useGetOrganizations: () => ({
    data: {
      data: {
        items: [
          { id: "org-1", name: "Organization 1" },
          { id: "org-2", name: "Organization 2" },
        ],
      },
    },
  }),
}));

vi.mock("@/hooks/usePermissionNavigate", () => ({
  usePermissionNavigate: () => ({
    to: mockTo,
  }),
}));

vi.mock("@/hooks/useSetCurrentProject", () => ({
  default: () => mockSetCurrentProject,
}));

// Mock jotai atoms
const mockSetCurrentOrganisationId = vi.fn();
const mockSetOrganisations = vi.fn();
const mockSetProjectList = vi.fn();

vi.mock("jotai", () => ({
  useAtom: vi.fn((atom) => {
    if (atom === "CURRENT_ORGANIZATION_ATOM") {
      return [null, mockSetCurrentOrganisationId];
    }
    if (atom === "ORGANIZATIONS_LIST_ATOM") {
      return [null, mockSetOrganisations];
    }
    if (atom === "PROJECT_LIST_ATOM") {
      return [null, mockSetProjectList];
    }
    return [null, vi.fn()];
  }),
}));

// Mock the atoms
vi.mock("@/state/atoms/organisation", () => ({
  CURRENT_ORGANIZATION_ATOM: "CURRENT_ORGANIZATION_ATOM",
  ORGANIZATIONS_LIST_ATOM: "ORGANIZATIONS_LIST_ATOM",
  PROJECT_LIST_ATOM: "PROJECT_LIST_ATOM",
}));

// Mock wouter
vi.mock("wouter", () => ({
  useSearchParams: () => [new URLSearchParams()],
}));

// Mock the Loading component
vi.mock("@/components/PageLoading", () => ({
  default: () => <div data-testid="loading">Loading...</div>,
}));

// Mock the delay utility
vi.mock("@/utils/common", () => ({
  delay: vi.fn().mockResolvedValue(undefined),
}));

describe("Redirection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset URL to avoid test interference
    // biome-ignore lint/performance/noDelete: <explanation>
    delete (window as any).location;
    window.location = { search: "" } as any;
  });

  it("should render loading component", () => {
    render(<Redirection />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("should navigate to welcome when no organizations", async () => {
    // Mock empty organizations
    vi.doMock("@/hooks/useGetOrganizations", () => ({
      useGetOrganizations: () => ({
        data: { data: { items: [] } },
      }),
    }));

    // Re-import the component to get the new mock
    const { default: RedirectionComponent } = await import("./index");
    render(<RedirectionComponent />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/profile/organisation/project?action=create",
      );
    });
  });

  it("should handle recent used data successfully", async () => {
    const mockRecentData = {
      projectId: "project-1",
      organizationId: "org-1",
    };

    const mockProjectInfo = {
      id: "project-1",
      displayName: "Test Project",
      domainName: "test.com",
      memberCount: 5,
      creationTime: Date.now(),
    };

    const mockProjectList = [mockProjectInfo];

    const { getRecentUsed } = await import("@/api/utils/project");
    const { getProjectList } = await import("@/api/utils/organization");

    vi.mocked(getRecentUsed).mockResolvedValue(mockRecentData);
    vi.mocked(getProjectList).mockResolvedValue(mockProjectList);

    render(<Redirection />);

    await waitFor(
      () => {
        expect(mockSetCurrentOrganisationId).toHaveBeenCalledWith("org-1");
      },
      { timeout: 2000 },
    );

    await waitFor(
      () => {
        expect(mockSetProjectList).toHaveBeenCalledWith(mockProjectList);
        expect(mockSetCurrentProject).toHaveBeenCalledWith(
          "project-1",
          "test.com",
        );
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard/workflows");
      },
      { timeout: 2000 },
    );
  });

  it("should handle recent used data when project not found", async () => {
    const mockRecentData = {
      projectId: "project-1",
      organizationId: "org-1",
    };

    const { getRecentUsed } = await import("@/api/utils/project");
    const { getProjectList } = await import("@/api/utils/organization");

    vi.mocked(getRecentUsed).mockResolvedValue(mockRecentData);
    vi.mocked(getProjectList).mockResolvedValue([]);

    render(<Redirection />);

    await waitFor(() => {
      expect(mockGetProjects).toHaveBeenCalled();
    });
  });

  it("should handle recent used data error", async () => {
    const { getRecentUsed } = await import("@/api/utils/project");
    vi.mocked(getRecentUsed).mockRejectedValue(new Error("API Error"));

    render(<Redirection />);

    await waitFor(() => {
      expect(mockGetProjects).toHaveBeenCalled();
    });
  });

  it("should handle projects fetch and redirect to first project", async () => {
    const mockProjectResponse = {
      code: "20000",
      data: {
        items: [
          { id: "project-1", domainName: "test1.com" },
          { id: "project-2", domainName: "test2.com" },
        ],
      },
    };

    const { getRecentUsed } = await import("@/api/utils/project");

    vi.mocked(getRecentUsed).mockResolvedValue({
      projectId: "project-1",
      organizationId: "org-1",
    });
    mockGetProjects.mockResolvedValue(mockProjectResponse);

    render(<Redirection />);

    await waitFor(
      () => {
        expect(mockSetCurrentOrganisationId).toHaveBeenCalledWith("org-1");
      },
      { timeout: 2000 },
    );

    await waitFor(
      () => {
        expect(mockSetProjectList).toHaveBeenCalledWith(
          mockProjectResponse.data.items,
        );
        expect(mockSetCurrentProject).toHaveBeenCalledWith(
          "project-1",
          "test1.com",
        );
      },
      { timeout: 2000 },
    );
  });

  it("should handle projects fetch error", async () => {
    const { getRecentUsed } = await import("@/api/utils/project");

    vi.mocked(getRecentUsed).mockResolvedValue({
      projectId: "project-1",
      organizationId: "org-1",
    });
    mockGetProjects.mockRejectedValue(new Error("API Error"));

    render(<Redirection />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/profile/organisation/project?action=create",
      );
    });
  });

  it("should handle no projects scenario", async () => {
    const mockProjectResponse = {
      code: "20000",
      data: { items: [] },
    };

    const { getRecentUsed } = await import("@/api/utils/project");

    vi.mocked(getRecentUsed).mockResolvedValue({
      projectId: "project-1",
      organizationId: "org-1",
    });
    mockGetProjects.mockResolvedValue(mockProjectResponse);

    render(<Redirection />);

    await waitFor(
      () => {
        expect(mockSetCurrentOrganisationId).toHaveBeenCalledWith("org-1");
      },
      { timeout: 2000 },
    );

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/profile/organisation/project?action=create",
        );
      },
      { timeout: 2000 },
    );
  });
});
