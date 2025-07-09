import { renderWithProviders } from "@/test/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import DllPage from ".";

vi.mock("@/components/DllTable", () => ({
  default: () => <div data-testid="dll-table" />,
}));
vi.mock("@/components/CrossURL", () => ({
  default: () => <div data-testid="cross-url" />,
}));
vi.mock("./Configuration", () => ({
  default: ({ onRestart }: any) => (
    // biome-ignore lint/a11y/useButtonType: <explanation>
    <button data-testid="restart-btn" onClick={onRestart}>
      Restart
    </button>
  ),
}));

// Mock jotai
vi.mock("jotai", async () => {
  const actual = await vi.importActual("jotai");
  return { ...actual, useAtom: vi.fn(() => [undefined, vi.fn()]) };
});

// Mock hooks
vi.mock("@/hooks/use-toast", async () => {
  const actual = await vi.importActual("@/hooks/use-toast");
  return { ...actual, useToast: vi.fn(() => ({ toast: vi.fn() })) };
});
vi.mock("@/hooks/useCurrentProject", async () => {
  const actual = await vi.importActual("@/hooks/useCurrentProject");
  return {
    ...actual,
    useCurrentProject: vi.fn(() => ({
      id: "test-id",
      domainName: "test-domain",
    })),
  };
});
vi.mock("@/hooks/useProjectPermissions", async () => {
  const actual = await vi.importActual("@/hooks/useProjectPermissions");
  return {
    ...actual,
    useProjectPermissions: vi.fn(() => ({
      projects: true,
      member: true,
      role: true,
      plugins: true,
      corsOrigins: true,
    })),
  };
});

// Mock API
vi.mock("@/api/utils/project", () => ({
  restartProjectServer: vi.fn(() => Promise.resolve("ok")),
}));

// Mock utils
vi.mock("@/utils/error", () => ({
  handleErrorMessage: vi.fn(() => "error-msg"),
}));

describe("DllPage", () => {
  it("should render all subcomponents", () => {
    renderWithProviders(<DllPage />);
    expect(screen.getByTestId("dll-table")).toBeInTheDocument();
    expect(screen.getByTestId("cross-url")).toBeInTheDocument();
    expect(screen.getByTestId("restart-btn")).toBeInTheDocument();
  });

  it("should call restartProjectServer and setRestartPodServer on restart", async () => {
    const { restartProjectServer } = await import("@/api/utils/project");
    const { useAtom } = await import("jotai");
    const setRestartPodServer = vi.fn();
    (useAtom as any).mockReturnValueOnce([undefined, setRestartPodServer]);
    renderWithProviders(<DllPage />);
    fireEvent.click(screen.getByTestId("restart-btn"));
    await waitFor(() => {
      expect(restartProjectServer).toHaveBeenCalledWith({
        projectId: "test-id",
        clientId: "test-domain",
      });
      expect(setRestartPodServer).toHaveBeenCalledWith({
        domain: "test-domain",
        projectId: "test-id",
      });
    });
  });

  it("should handle restart error and show toast", async () => {
    const { restartProjectServer } = await import("@/api/utils/project");
    (restartProjectServer as any).mockImplementationOnce(() =>
      Promise.reject("fail"),
    );
    const { useToast } = await import("@/hooks/use-toast");
    const toast = vi.fn();
    (useToast as any).mockReturnValue({ toast });
    renderWithProviders(<DllPage />);
    fireEvent.click(screen.getByTestId("restart-btn"));
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({ description: "error-msg" });
    });
  });

  it("should not crash if curProject is undefined", async () => {
    const { useCurrentProject } = await import("@/hooks/useCurrentProject");
    (useCurrentProject as any).mockReturnValue(undefined);
    renderWithProviders(<DllPage />);
    fireEvent.click(screen.getByTestId("restart-btn"));
    // No error thrown
  });
});
