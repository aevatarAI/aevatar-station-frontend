import { getRestartStatus } from "@/api/utils/plugin";
import { RESTART_POD_SERVER_ATOM } from "@/state/atoms/dll";
import { CURRENT_PROJECT_ATOM } from "@/state/atoms/organisation";
import { render, waitFor } from "@testing-library/react";
import { useAtom } from "jotai";
import { vi } from "vitest";
import RestartPodServer from "./index";

// Mock related dependencies
vi.mock("@/api/utils/plugin", () => ({
  getRestartStatus: vi.fn(),
}));
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(() => ({ dismiss: vi.fn() })),
  }),
}));
vi.mock("jotai", async () => {
  const actual = await vi.importActual("jotai");
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});
vi.mock("@/utils/common", () => ({
  delay: vi.fn(() => Promise.resolve()),
}));

// Define mockToast at the top and globally mock useToast
const mockToast = vi.fn(() => ({ dismiss: vi.fn() }));
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

describe("RestartPodServer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockToast.mockClear();
  });

  it("should return null on initial render", () => {
    (useAtom as any).mockImplementation(() => [undefined, vi.fn()]);
    const { container } = render(<RestartPodServer />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should poll and reset when restartPodServer.projectId matches current projectId", async () => {
    vi.useFakeTimers();
    const mockProjectId = "pid";
    const mockDomain = "domain";
    (useAtom as any).mockImplementation((atom: any) => {
      if (atom === CURRENT_PROJECT_ATOM) return [mockProjectId];
      if (atom === RESTART_POD_SERVER_ATOM)
        return [{ projectId: mockProjectId, domain: mockDomain }, vi.fn()];
      return [undefined, vi.fn()];
    });
    (getRestartStatus as any)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    render(<RestartPodServer />);
    // Advance timers until getRestartStatus is called twice
    let max = 10;
    while ((getRestartStatus as any).mock.calls.length < 2 && max-- > 0) {
      await vi.runOnlyPendingTimersAsync();
      await Promise.resolve();
      await Promise.resolve();
    }
    expect(getRestartStatus).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  }, 15000);

  it("should not poll when restartPodServer.projectId does not match current projectId", async () => {
    vi.useFakeTimers();
    (useAtom as any).mockImplementation((atom: any) => {
      if (atom === CURRENT_PROJECT_ATOM) return ["pid"];
      if (atom === RESTART_POD_SERVER_ATOM)
        return [{ projectId: "other", domain: "domain" }, vi.fn()];
      return [undefined, vi.fn()];
    });
    render(<RestartPodServer />);
    await vi.runOnlyPendingTimersAsync();
    await Promise.resolve();
    expect(getRestartStatus).not.toHaveBeenCalled();
    vi.useRealTimers();
  }, 15000);

  // Capture global unhandledRejection to avoid Vitest errors
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  let lastUnhandled: any = null;
  beforeAll(() => {
    process.on("unhandledRejection", handler);
    function handler(err: any) {
      lastUnhandled = err;
    }
  });
  afterAll(() => {
    process.removeAllListeners("unhandledRejection");
  });

  it("exception scenario: getRestartStatus throws an error", async () => {
    vi.useFakeTimers();
    (useAtom as any).mockImplementation((atom: any) => {
      if (atom === CURRENT_PROJECT_ATOM) return ["pid"];
      if (atom === RESTART_POD_SERVER_ATOM)
        return [{ projectId: "pid", domain: "domain" }, vi.fn()];
      return [undefined, vi.fn()];
    });
    (getRestartStatus as any).mockRejectedValueOnce(new Error("fail"));
    render(<RestartPodServer />);
    let max = 10;
    while ((getRestartStatus as any).mock.calls.length < 1 && max-- > 0) {
      await vi.runOnlyPendingTimersAsync();
      await Promise.resolve();
      await Promise.resolve();
    }
    await Promise.resolve();
    await Promise.resolve();
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ description: "fail" }),
    );
    vi.useRealTimers();
  }, 15000);
});
