import { act, render, screen, waitFor } from "@testing-library/react";
import { useAtom } from "jotai";
import { vi } from "vitest";
import App from "./App";

// Mock wouter
vi.mock("wouter", () => ({
  Route: ({ children, path }: { children: React.ReactNode; path?: string }) => (
    <div data-testid={`route-${path || "default"}`}>{children}</div>
  ),
  Switch: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="switch">{children}</div>
  ),
  Redirect: ({ to }: { to: string }) => (
    <div data-testid={`redirect-to-${to}`}>Redirecting to {to}</div>
  ),
}));

// Mock Jotai
vi.mock("jotai", () => ({
  useAtom: vi.fn(),
}));

// Mock API service
vi.mock("@/api/axios", () => ({
  service: {
    defaults: {
      headers: {
        Authorization: "",
      },
    },
  },
}));

// Mock components
vi.mock("@/app/Account/Login", () => ({
  default: () => <div data-testid="login">Login Component</div>,
}));

vi.mock("@/app/Account/Register", () => ({
  default: () => <div data-testid="register">Register Component</div>,
}));

vi.mock("@/app/Account/ResetPassword", () => ({
  default: () => (
    <div data-testid="reset-password">Reset Password Component</div>
  ),
}));

vi.mock("@/app/Account/Vertification", () => ({
  default: () => <div data-testid="verification">Verification Component</div>,
}));

vi.mock("@/app/Redirection", () => ({
  default: () => <div data-testid="redirection">Redirection Component</div>,
}));

vi.mock("@/app/SocialLogin/github", () => ({
  GithubLoginCallback: () => (
    <div data-testid="github-callback">GitHub Callback</div>
  ),
}));

vi.mock("@/app/SocialLogin/google", () => ({
  GoogleLoginCallback: () => (
    <div data-testid="google-callback">Google Callback</div>
  ),
}));

vi.mock("@/app/demo", () => ({
  default: () => <div data-testid="demo">Demo Component</div>,
}));

vi.mock("@/app/Welcome", () => ({
  default: () => <div data-testid="welcome">Welcome Component</div>,
}));

vi.mock("@/components/Header", () => ({
  default: () => <div data-testid="header">Header Component</div>,
}));

vi.mock("@/components/ProjectInitialisingLoading", () => ({
  default: () => <div data-testid="project-loading">Project Loading</div>,
}));

vi.mock("@/components/PageLoading", () => ({
  default: () => <div data-testid="page-loading">Page Loading</div>,
}));

vi.mock("@/hooks/AccessTokenUpdater", () => ({
  AccessTokenUpdater: () => (
    <div data-testid="access-token-updater">Access Token Updater</div>
  ),
}));

vi.mock("@/hooks/SetAuthHeader", () => ({
  SetAuthHeader: () => <div data-testid="set-auth-header">Set Auth Header</div>,
}));

vi.mock("@/layouts/LayoutDefault", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout-default">{children}</div>
  ),
}));

vi.mock("@/state/atoms", () => ({
  accessTokenAtom: "mock-access-token-atom",
}));

// Mock lazy components
vi.mock("./app/Profile", () => ({
  default: () => <div data-testid="profile">Profile Component</div>,
}));

vi.mock("./app/Dashboard", () => ({
  default: () => <div data-testid="dashboard">Dashboard Component</div>,
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  it("should render the main app structure", () => {
    (useAtom as any).mockReturnValue([null]);
    (window.localStorage.getItem as any).mockReturnValue(null);

    render(<App />);

    expect(screen.getByTestId("layout-default")).toBeInTheDocument();
    expect(screen.getByTestId("switch")).toBeInTheDocument();
    expect(screen.getByTestId("project-loading")).toBeInTheDocument();
  });

  it("should render WithLazyLoading component with header", () => {
    (useAtom as any).mockReturnValue([null]);
    (window.localStorage.getItem as any).mockReturnValue(null);

    render(<App />);

    // Check if header is rendered in lazy loading components
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("should render WithLazyLoadingNoHaeader component without header", () => {
    (useAtom as any).mockReturnValue([null]);
    (window.localStorage.getItem as any).mockReturnValue(null);

    render(<App />);

    // The login route should be rendered (there might be multiple, so check if any exist)
    expect(screen.getAllByTestId("login")).toHaveLength(2); // One for "/" and one for "/login"
  });

  it("should render PrivateRoute with authentication", async () => {
    const mockAccessToken = "mock-access-token";
    (useAtom as any).mockReturnValue([mockAccessToken]);
    (window.localStorage.getItem as any).mockReturnValue(mockAccessToken);

    await act(async () => {
      render(<App />);
    });

    // Should render welcome component for authenticated user
    await waitFor(() => {
      expect(screen.getByTestId("welcome")).toBeInTheDocument();
    });

    // There might be multiple access-token-updaters, so check if any exist
    expect(
      screen.getAllByTestId("access-token-updater").length,
    ).toBeGreaterThan(0);
    expect(screen.getByTestId("set-auth-header")).toBeInTheDocument();
  });

  it("should redirect to login when not authenticated", () => {
    (useAtom as any).mockReturnValue([null]);
    (window.localStorage.getItem as any).mockReturnValue(null);

    render(<App />);

    // Should show login component (there might be multiple, so check if any exist)
    expect(screen.getAllByTestId("login").length).toBeGreaterThan(0);
  });

  it("should render all public routes", () => {
    (useAtom as any).mockReturnValue([null]);
    (window.localStorage.getItem as any).mockReturnValue(null);

    render(<App />);

    // Check that all public routes are available
    expect(screen.getByTestId("route-/")).toBeInTheDocument();
    expect(
      screen.getByTestId("route-/auth/github/callback"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("route-/auth/google/callback"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("route-/login")).toBeInTheDocument();
    expect(screen.getByTestId("route-/register")).toBeInTheDocument();
    expect(screen.getByTestId("route-/verification")).toBeInTheDocument();
    expect(screen.getByTestId("route-/reset-password")).toBeInTheDocument();
  });

  it("should render all private routes when authenticated", () => {
    const mockAccessToken = "mock-access-token";
    (useAtom as any).mockReturnValue([mockAccessToken]);
    (window.localStorage.getItem as any).mockReturnValue(mockAccessToken);

    render(<App />);

    // Check that private routes are available
    expect(screen.getByTestId("route-/welcome")).toBeInTheDocument();
    expect(screen.getByTestId("route-/demo")).toBeInTheDocument();
    expect(screen.getByTestId("route-/profile/:menu/:tab")).toBeInTheDocument();
    expect(screen.getByTestId("route-/profile/:menu")).toBeInTheDocument();
    expect(screen.getByTestId("route-/profile")).toBeInTheDocument();
    expect(screen.getByTestId("route-/dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("route-/dashboard/:tab")).toBeInTheDocument();
    expect(screen.getByTestId("route-/redirect")).toBeInTheDocument();
  });

  it("should render 404 page for unknown routes", () => {
    (useAtom as any).mockReturnValue([null]);
    (window.localStorage.getItem as any).mockReturnValue(null);

    render(<App />);

    // Check that 404 route is available
    expect(screen.getByTestId("route-default")).toBeInTheDocument();
  });

  it("should handle authentication state correctly", () => {
    const mockAccessToken = "mock-access-token";
    (useAtom as any).mockReturnValue([mockAccessToken]);
    (window.localStorage.getItem as any).mockReturnValue(mockAccessToken);

    render(<App />);

    // Should render authenticated components
    expect(screen.getByTestId("welcome")).toBeInTheDocument();
  });

  it("should handle unauthenticated state correctly", () => {
    (useAtom as any).mockReturnValue([null]);
    (window.localStorage.getItem as any).mockReturnValue(null);

    render(<App />);

    // Should render login components
    expect(screen.getAllByTestId("login").length).toBeGreaterThan(0);
  });
});
