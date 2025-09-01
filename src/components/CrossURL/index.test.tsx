import {
  addProjectCorsOrigin,
  deleteProjectCorsOrigin,
  getCrossURLs,
} from "@/api/utils/plugin";
import Configuration from "@/components/DllPage/Configuration";
import { useToast } from "@/hooks/use-toast";
import { CURRENT_PROJECT_ATOM } from "@/state/atoms/organisation";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useAtom } from "jotai";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CrossURL from "./index";

vi.mock("jotai", async () => {
  const actual = await vi.importActual("jotai");
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});

vi.mock("@/api/utils/plugin", () => ({
  getCrossURLs: vi.fn(),
  addProjectCorsOrigin: vi.fn(),
  deleteProjectCorsOrigin: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

vi.mock("@/hooks/useProjectPermissions", () => ({
  useProjectPermissions: () => ({
    corsOriginsDelete: true,
    corsOriginsCreate: true,
  }),
}));

vi.mock("@/components/CreateCrossURLDialog", () => ({
  __esModule: true,
  default: ({ onSubmit }: { onSubmit: any }) => (
    <button
      type="button"
      data-testid="create-cross-url-button"
      onClick={() => onSubmit({ domain: "https://test.com" })}
    >
      add
    </button>
  ),
}));

vi.mock("@/components/DeleteDialog", () => ({
  __esModule: true,
  default: ({ onYes, ...props }: { onYes: any; [key: string]: any }) => (
    <button type="button" {...props} onClick={onYes}>
      delete
    </button>
  ),
}));

describe("CrossURL Component", () => {
  const mockToast = vi.fn();
  const mockProjectId = "project-1";
  const mockCrossURLs = [
    {
      id: "1",
      domain: "https://example.com/api1",
      projectId: mockProjectId,
      creationTime: Date.now() - 100000,
      creatorName: "Alice",
    },
    {
      id: "2",
      domain: "https://example.com/api2",
      projectId: mockProjectId,
      creationTime: Date.now() - 50000,
      creatorName: "Bob",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === CURRENT_PROJECT_ATOM) return [mockProjectId] as any;
      return [null];
    });
    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });
    vi.mocked(getCrossURLs).mockResolvedValue(mockCrossURLs);
    vi.mocked(addProjectCorsOrigin).mockResolvedValue({
      ...mockCrossURLs[0],
      id: "3",
      domain: "https://test.com",
      creatorName: "Tester",
      creationTime: Date.now(),
    });
    vi.mocked(deleteProjectCorsOrigin).mockResolvedValue();
  });

  it("should render and fetch cross URLs", async () => {
    render(<CrossURL />);
    await waitFor(() => {
      expect(getCrossURLs).toHaveBeenCalledWith(mockProjectId);
      expect(screen.getByText("CORS")).toBeInTheDocument();
      expect(screen.getByText("https://example.com/api1")).toBeInTheDocument();
      expect(screen.getByText("https://example.com/api2")).toBeInTheDocument();
    });
  });

  it("should show empty message when no cross URLs", async () => {
    vi.mocked(getCrossURLs).mockResolvedValueOnce([]);
    render(<CrossURL />);
    await waitFor(() => {
      expect(screen.getByTestId("empty-dll-message")).toBeInTheDocument();
    });
  });

  it("should handle add cross URL", async () => {
    render(<CrossURL />);
    const addBtn = await screen.findByTestId("create-cross-url-button");
    await act(async () => {
      fireEvent.click(addBtn);
    });
    await waitFor(() => {
      expect(addProjectCorsOrigin).toHaveBeenCalledWith(
        mockProjectId,
        "https://test.com",
      );
      expect(mockToast).toHaveBeenCalledWith({
        description: "Cross-origin domain added",
      });
      expect(getCrossURLs).toHaveBeenCalledTimes(2); // initial + after add
    });
  });

  it("should handle add cross URL error", async () => {
    vi.mocked(addProjectCorsOrigin).mockRejectedValueOnce(
      new Error("add error"),
    );
    render(<CrossURL />);
    const addBtn = await screen.findByTestId("create-cross-url-button");
    await act(async () => {
      fireEvent.click(addBtn);
    });
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({ description: "add error" });
    });
  });

  it("should handle delete cross URL", async () => {
    render(<CrossURL />);
    const deleteBtns = await screen.findAllByTestId("delete-cross-url-button");
    await act(async () => {
      fireEvent.click(deleteBtns[0]);
    });
    await waitFor(() => {
      expect(deleteProjectCorsOrigin).toHaveBeenCalledWith(
        mockProjectId,
        mockCrossURLs[0].id,
      );
      expect(mockToast).toHaveBeenCalledWith({
        description: "Cross-origin domain deleted",
      });
      expect(getCrossURLs).toHaveBeenCalledTimes(2); // initial + after delete
    });
  });

  it("should handle delete cross URL error", async () => {
    vi.mocked(deleteProjectCorsOrigin).mockRejectedValueOnce(
      new Error("delete error"),
    );
    render(<CrossURL />);
    const deleteBtns = await screen.findAllByTestId("delete-cross-url-button");
    await act(async () => {
      fireEvent.click(deleteBtns[0]);
    });
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({ description: "delete error" });
    });
  });

  it("should not fetch or operate if projectId is null", async () => {
    vi.mocked(useAtom).mockImplementation(() => [null] as any);
    render(<CrossURL />);
    await waitFor(() => {
      expect(getCrossURLs).not.toHaveBeenCalled();
    });
  });

  it("should not add cross URL if projectId is null", async () => {
    vi.mocked(useAtom).mockImplementation(() => [null] as any);
    render(<CrossURL />);
    const addBtn = await screen.findByTestId("create-cross-url-button");
    await act(async () => {
      fireEvent.click(addBtn);
    });
    await waitFor(() => {
      expect(addProjectCorsOrigin).not.toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith({
        description: "Project ID is required",
      });
    });
  });

  it("should not delete cross URL if projectId is null", async () => {
    vi.mocked(useAtom).mockImplementation(() => [null] as any);
    render(<CrossURL />);
    expect(screen.queryByTestId("delete-cross-url-button")).toBeNull();
    expect(mockToast).not.toHaveBeenCalled();
  });
});

describe("Configuration Component", () => {
  it("should render title and button", () => {
    render(<Configuration />);
    expect(screen.getByText("configuration")).toBeInTheDocument();
    expect(screen.getByText("restart services")).toBeInTheDocument();
  });

  it("should call onRestart when button clicked", () => {
    const onRestart = vi.fn();
    render(<Configuration onRestart={onRestart} />);
    fireEvent.click(screen.getByText("restart services"));
    expect(onRestart).toHaveBeenCalled();
  });

  it("should not fail if onRestart is not provided", () => {
    render(<Configuration />);
    fireEvent.click(screen.getByText("restart services"));
    // No error thrown
  });
});
