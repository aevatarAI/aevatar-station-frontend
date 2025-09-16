import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import WelcomePage from "./index";

// Mock the API functions
vi.mock("@/api/utils/organization", () => ({
  createOrganizationWithDefaultProject: vi.fn(),
}));

vi.mock("@/services/auth", () => ({
  refreshTokenLogin: vi.fn(),
}));

// Mock the hooks
const mockNavigate = vi.fn();
const mockToast = vi.fn();
const mockMutateAsync = vi.fn();
const mockCreateDefaultProject = vi.fn();

vi.mock("@/hooks/navigate", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock("@/hooks/useCreateDefaultProject", () => ({
  useCreateDefaultProject: () => mockCreateDefaultProject,
}));

vi.mock("@/hooks/useEmail", () => ({
  useEmail: () => "test@example.com",
}));

vi.mock("@/hooks/useGetInvitations", () => ({
  useGetInvitations: () => ({
    invites: [
      { id: "invite-1", organizationName: "Test Org 1" },
      { id: "invite-2", organizationName: "Test Org 2" },
    ],
    hasInvites: true,
    selectedValues: [],
    setSelectedValues: vi.fn(),
  }),
}));

vi.mock("@/hooks/useGetOrganisationInvites", () => ({
  useGetOrganisationInvites: () => ({
    data: { items: [] },
    isLoading: false,
  }),
}));

vi.mock("@/hooks/useGetOrganizations", () => ({
  useGetOrganizations: () => ({
    data: { data: { items: [] } },
  }),
}));

vi.mock("@/hooks/useUpdateNotifications", () => ({
  useUpdateJoinNotifications: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

// Mock jotai atoms
const mockSetAccessToken = vi.fn();
const mockSetRefreshToken = vi.fn();
const mockSetCurrentOrganization = vi.fn();

vi.mock("jotai", async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    useAtom: vi.fn((atom) => {
      if (atom === "accessTokenAtom") {
        return [null, mockSetAccessToken];
      }
      if (atom === "refreshTokenAtom") {
        return ["refresh-token", mockSetRefreshToken];
      }
      if (atom === "CURRENT_ORGANIZATION_ATOM") {
        return [null, mockSetCurrentOrganization];
      }
      return [null, vi.fn()];
    }),
  };
});

// Mock the atoms
vi.mock("@/state/atoms", () => ({
  accessTokenAtom: "accessTokenAtom",
  refreshTokenAtom: "refreshTokenAtom",
}));

vi.mock("@/state/atoms/organisation", () => ({
  CURRENT_ORGANIZATION_ATOM: "CURRENT_ORGANIZATION_ATOM",
}));

// Mock the components
vi.mock("@/components/Copy", () => ({
  default: ({
    toCopy,
    description,
  }: {
    toCopy: string;
    description: string;
  }) => (
    // biome-ignore lint/a11y/useButtonType: <explanation>
    <button
      data-testid="copy-button"
      data-copy={toCopy}
      data-description={description}
    >
      Copy
    </button>
  ),
}));

vi.mock("@/components/CreateOrgDialog", () => ({
  default: ({ onCreate }: { onCreate: (values: any) => void }) => (
    // biome-ignore lint/a11y/useButtonType: <explanation>
    <button
      data-testid="create-org-button"
      onClick={() => onCreate({ orgName: "Test Organization" })}
    >
      Create Organization
    </button>
  ),
}));

vi.mock("@/components/Loading", () => ({
  default: () => <div data-testid="loading">Loading...</div>,
}));

vi.mock("@/components/SocialMediaReander", () => ({
  default: ({ className }: { className: string }) => (
    <div
      data-testid="social-media"
      className={
        className ||
        "relative lg:absolute w-full lg:w-[275px] bottom-[40px] lg:px-0 mt-[58px] justify-around"
      }
    >
      Social Media
    </div>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, className }: any) => (
    // biome-ignore lint/a11y/useButtonType: <explanation>
    <button
      data-testid="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/checkbox-group", () => ({
  CheckboxGroup: ({ data, values, onChange }: any) => (
    <div data-testid="checkbox-group">
      {data.map((item: any) => (
        <label key={item.id}>
          <input
            type="checkbox"
            checked={values.includes(item.id)}
            onChange={() => onChange([...values, item.id])}
          />
          {item.organizationName}
        </label>
      ))}
    </div>
  ),
}));

// Mock the assets
vi.mock("@/assets/logo.svg?react", () => ({
  default: ({ className }: { className?: string }) => (
    <div data-testid="logo" className={className} />
  ),
}));

// Mock the constants
vi.mock("@/constants", () => ({
  ACCEPTED: "accepted",
}));

// Mock the form constants
vi.mock("@/constants/form/createOrg", () => ({
  TCreateOrgForm: {},
}));

describe("WelcomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the welcome page with all main elements", () => {
    render(<WelcomePage />);

    // Check for main heading
    expect(screen.getByText("welcome to aevatar.ai")).toBeInTheDocument();
    expect(
      screen.getByText("create or join an organisation"),
    ).toBeInTheDocument();

    // Check for logo
    expect(screen.getByTestId("logo")).toBeInTheDocument();

    // Check for create organization section
    expect(screen.getByText("create a new organisation")).toBeInTheDocument();
    expect(
      screen.getByText("create a new organisation - You will be the owner"),
    ).toBeInTheDocument();

    // Check for join organization section
    expect(
      screen.getByText("join an existing organisation"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("pending invitations for your approval"),
    ).toBeInTheDocument();

    // Check for social media
    expect(screen.getByTestId("social-media")).toBeInTheDocument();
  });

  it("should render create organization dialog", () => {
    render(<WelcomePage />);

    expect(screen.getByTestId("create-org-button")).toBeInTheDocument();
  });

  it("should render checkbox group for invitations", () => {
    render(<WelcomePage />);

    expect(screen.getByTestId("checkbox-group")).toBeInTheDocument();
    expect(screen.getByText("Test Org 1")).toBeInTheDocument();
    expect(screen.getByText("Test Org 2")).toBeInTheDocument();
  });

  it("should render join button", () => {
    render(<WelcomePage />);

    const joinButton = screen.getByText("join");
    expect(joinButton).toBeInTheDocument();
    expect(joinButton).toHaveAttribute("disabled");
  });

  it("should handle create organization", async () => {
    const mockResponse = {
      id: "org-1",
      displayName: "Test Organization",
      memberCount: 5,
      creationTime: Date.now(),
      project: {
        id: "project-1",
        displayName: "Test Project",
        domainName: "test.com",
        memberCount: 5,
        creationTime: Date.now(),
      },
    };

    const { createOrganizationWithDefaultProject } = await import(
      "@/api/utils/organization"
    );
    vi.mocked(createOrganizationWithDefaultProject).mockResolvedValue(
      mockResponse,
    );

    render(<WelcomePage />);

    const createButton = screen.getByTestId("create-org-button");
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(createOrganizationWithDefaultProject).toHaveBeenCalledWith(
        "Test Organization",
      );
      expect(mockSetCurrentOrganization).toHaveBeenCalledWith("org-1");
      expect(mockToast).toHaveBeenCalledWith({
        description: "Organization created",
      });
      expect(mockCreateDefaultProject).toHaveBeenCalledWith("org-1", {
        id: "project-1",
        displayName: "Test Project",
        domainName: "test.com",
        memberCount: 5,
        creationTime: expect.any(Number),
      });
    });
  });

  it("should render with correct CSS classes", () => {
    render(<WelcomePage />);

    const container = screen
      .getByText("welcome to aevatar.ai")
      .closest("div")?.parentElement;
    expect(container).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "lg:justify-center",
      "relative",
      "min-h-[800px]",
      "h-[calc(100vh-60px)]",
      "px-5",
    );
  });

  it("should render social media with correct classes", () => {
    render(<WelcomePage />);

    const socialMedia = screen.getByTestId("social-media");
    expect(socialMedia).toHaveClass("relative");
    expect(socialMedia).toHaveClass("lg:absolute");
    expect(socialMedia).toHaveClass("w-full");
    expect(socialMedia).toHaveClass("lg:w-[275px]");
    expect(socialMedia).toHaveClass("bottom-[40px]");
    expect(socialMedia).toHaveClass("lg:px-0");
    expect(socialMedia).toHaveClass("mt-[58px]");
    expect(socialMedia).toHaveClass("justify-around");
  });
});
