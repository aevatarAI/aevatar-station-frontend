/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/api";
import type { IDllPlugin } from "@/api/utils/plugin";
import { ELoadStatus } from "@/api/utils/plugin";
import { textGradient } from "@/constants/cls";
import type { TDllEditForm } from "@/constants/form/dll";
import { useToast } from "@/hooks/use-toast";
import { useUpdateDllList } from "@/hooks/useUpdateDllList";
import { DLL_LIST_ATOM, RESTART_POD_SERVER_ATOM } from "@/state/atoms/dll";
import { CURRENT_PROJECT_ATOM } from "@/state/atoms/organisation";
import { renderWithProviders } from "@/test/test-utils";
import { handleErrorMessage } from "@/utils/error";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAtom } from "jotai";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DllTable from "../index";

// Mock all external dependencies
vi.mock("@/api", () => ({
  request: {
    plugins: {
      updatePlugins: vi.fn(),
      addPlugins: vi.fn(),
      deletePlugins: vi.fn(),
    },
  },
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

vi.mock("@/hooks/useUpdateDllList", () => ({
  useUpdateDllList: vi.fn(),
}));

vi.mock("@/utils/error", () => ({
  handleErrorMessage: vi.fn(),
}));

vi.mock("jotai", async () => {
  const actual = await vi.importActual("jotai");
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});

// Mock child components
vi.mock("@/components/DataTable", () => ({
  __esModule: true,
  default: ({ data, loading, emptyNode, className, ...props }: any) => {
    const mockData = data || [];

    return (
      <div className={className} {...props}>
        {loading ? (
          <div data-testid="loading">Loading...</div>
        ) : mockData.length > 0 ? (
          mockData.map((item: any, index: number) => (
            <div
              key={item.id || `item-${index}`}
              data-testid={`dll-item-${item.id || index}`}
            >
              <span>{item.name}</span>
              {item.operation && (
                <div data-testid={`operations-${item.id || index}`}>
                  {item.operation}
                </div>
              )}
            </div>
          ))
        ) : (
          <div data-testid="empty-state">{emptyNode}</div>
        )}
      </div>
    );
  },
}));

vi.mock("@/components/DeleteDialog", () => ({
  __esModule: true,
  default: ({ onYes, title, ...props }: any) => (
    <button
      data-testid={props["data-testid"]}
      onClick={onYes}
      title={title}
      {...props}
    >
      Delete
    </button>
  ),
}));

vi.mock("@/components/DllEditDialog", () => ({
  __esModule: true,
  default: ({ type, onSubmit, disabled, ...props }: any) => (
    <button
      {...props}
      onClick={() => {
        if (type === "create") {
          onSubmit?.({ file: [{ content: "test dll content" }] });
        } else {
          // For edit, we need to match the actual component behavior
          // The real component passes the item.id, but our mock should use item.id from the test context
          const itemId =
            props["data-testid"]?.replace("edit-dll-", "") || "test-id";
          onSubmit?.({ file: [{ content: "updated dll content" }] }, itemId);
        }
      }}
      disabled={disabled}
    >
      {type === "create" ? "Create DLL" : "Edit DLL"}
    </button>
  ),
}));

vi.mock("@/components/DllTable/columns", () => ({
  columns: [
    { id: "name", header: "Name" },
    { id: "operation", header: "Operations" },
  ],
}));

vi.mock("@/constants/cls", () => ({
  textGradient: "gradient-text-class",
}));

vi.mock("clsx", () => ({
  __esModule: true,
  default: (...args: any[]) => args.filter(Boolean).join(" "),
}));

// Mock window.scrollTo
Object.defineProperty(window, "scrollTo", {
  value: vi.fn(),
  writable: true,
});

describe("DllTable Component", () => {
  const mockToast = vi.fn();
  const mockUpdateDllHandler = vi.fn();
  const mockUseAtom = useAtom as any;

  // Mock data
  const mockDllList: IDllPlugin[] = [
    {
      id: "dll-1",
      name: "test-dll-1.dll",
      creationTime: 1640995200000, // 2022-01-01
      lastModificationTime: 1640995200000,
      lastModifierName: "John Doe",
      creatorName: "Jane Doe",
      loadStatus: ELoadStatus.Deployed,
    },
    {
      id: "dll-2",
      name: "test-dll-2.dll",
      creationTime: 1640995200000,
      lastModificationTime: 1640995300000,
      lastModifierName: null,
      creatorName: "Bob Smith",
      loadStatus: ELoadStatus.Uploaded,
    },
  ];

  const mockProjectId = "project-123";
  const mockRestartPodServer = {
    projectId: "project-123",
    domain: "test-domain.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    (useToast as any).mockReturnValue({ toast: mockToast });
    (useUpdateDllList as any).mockReturnValue(mockUpdateDllHandler);
    (handleErrorMessage as any).mockReturnValue("Mocked error message");

    // Default atom values
    mockUseAtom.mockImplementation((atom: any) => {
      if (atom === DLL_LIST_ATOM) return [mockDllList, vi.fn()];
      if (atom === CURRENT_PROJECT_ATOM) return [mockProjectId, vi.fn()];
      if (atom === RESTART_POD_SERVER_ATOM)
        return [mockRestartPodServer, vi.fn()];
      return [undefined, vi.fn()];
    });

    mockUpdateDllHandler.mockResolvedValue(undefined);
    (request.plugins.updatePlugins as any).mockResolvedValue(undefined);
    (request.plugins.addPlugins as any).mockResolvedValue(undefined);
    (request.plugins.deletePlugins as any).mockResolvedValue(undefined);
  });

  describe("Rendering", () => {
    it("should render the component with correct structure", () => {
      renderWithProviders(<DllTable />);

      expect(screen.getByText("dll")).toBeInTheDocument();
      expect(screen.getByTestId("dll-table")).toBeInTheDocument();
      expect(screen.getByTestId("create-dll-button")).toBeInTheDocument();
    });

    it("should render with loading state initially", async () => {
      renderWithProviders(<DllTable />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
      });
    });

    it("should render empty state when no DLLs", async () => {
      mockUseAtom.mockImplementation((atom: any) => {
        if (atom === DLL_LIST_ATOM) return [[], vi.fn()];
        if (atom === CURRENT_PROJECT_ATOM) return [mockProjectId, vi.fn()];
        if (atom === RESTART_POD_SERVER_ATOM) return [null, vi.fn()];
        return [undefined, vi.fn()];
      });

      renderWithProviders(<DllTable />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
      });

      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
      expect(screen.getByText("No DLLs uploaded yet")).toBeInTheDocument();
    });

    it("should render DLL list when data is available", async () => {
      renderWithProviders(<DllTable />);

      await waitFor(() => {
        expect(screen.getByTestId("dll-item-dll-1")).toBeInTheDocument();
        expect(screen.getByTestId("dll-item-dll-2")).toBeInTheDocument();
        expect(screen.getByText("test-dll-1.dll")).toBeInTheDocument();
        expect(screen.getByText("test-dll-2.dll")).toBeInTheDocument();
      });
    });

    it("should disable create button when restart server is in progress", () => {
      renderWithProviders(<DllTable />);

      const createButton = screen.getByTestId("create-dll-button");
      expect(createButton).toHaveAttribute("disabled");
    });

    it("should enable create button when restart server is not in progress", () => {
      mockUseAtom.mockImplementation((atom: any) => {
        if (atom === DLL_LIST_ATOM) return [mockDllList, vi.fn()];
        if (atom === CURRENT_PROJECT_ATOM) return [mockProjectId, vi.fn()];
        if (atom === RESTART_POD_SERVER_ATOM) return [null, vi.fn()];
        return [undefined, vi.fn()];
      });

      renderWithProviders(<DllTable />);

      const createButton = screen.getByTestId("create-dll-button");
      expect(createButton).not.toHaveAttribute("disabled");
    });

    it("should enable create button when restart server is for different project", () => {
      const differentRestartServer = {
        projectId: "different-project",
        domain: "other-domain.com",
      };

      mockUseAtom.mockImplementation((atom: any) => {
        if (atom === DLL_LIST_ATOM) return [mockDllList, vi.fn()];
        if (atom === CURRENT_PROJECT_ATOM) return [mockProjectId, vi.fn()];
        if (atom === RESTART_POD_SERVER_ATOM)
          return [differentRestartServer, vi.fn()];
        return [undefined, vi.fn()];
      });

      renderWithProviders(<DllTable />);

      const createButton = screen.getByTestId("create-dll-button");
      expect(createButton).not.toHaveAttribute("disabled");
    });
  });

  describe("Component Lifecycle", () => {
    it("should call updateDllList on mount", async () => {
      renderWithProviders(<DllTable />);

      await waitFor(() => {
        expect(mockUpdateDllHandler).toHaveBeenCalledWith(mockProjectId);
      });
    });

    it("should not call updateDllList when projectId is not available", async () => {
      mockUseAtom.mockImplementation((atom: any) => {
        if (atom === DLL_LIST_ATOM) return [[], vi.fn()];
        if (atom === CURRENT_PROJECT_ATOM) return [null, vi.fn()];
        if (atom === RESTART_POD_SERVER_ATOM) return [null, vi.fn()];
        return [undefined, vi.fn()];
      });

      renderWithProviders(<DllTable />);

      await waitFor(() => {
        expect(mockUpdateDllHandler).not.toHaveBeenCalled();
      });
    });

    it("should scroll to top after updating DLL list", async () => {
      renderWithProviders(<DllTable />);

      await waitFor(() => {
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
      });
    });
  });

  describe("CRUD Operations", () => {
    beforeEach(() => {
      // Ensure restart server is null for CRUD operations
      mockUseAtom.mockImplementation((atom: any) => {
        if (atom === DLL_LIST_ATOM) return [mockDllList, vi.fn()];
        if (atom === CURRENT_PROJECT_ATOM) return [mockProjectId, vi.fn()];
        if (atom === RESTART_POD_SERVER_ATOM) return [null, vi.fn()];
        return [undefined, vi.fn()];
      });
    });

    describe("Create Operation", () => {
      it("should create a new DLL successfully", async () => {
        const user = userEvent.setup();
        renderWithProviders(<DllTable />);

        const createButton = screen.getByTestId("create-dll-button");
        await user.click(createButton);

        await waitFor(() => {
          expect(request.plugins.addPlugins).toHaveBeenCalledWith({
            data: {
              projectId: mockProjectId,
              code: "test dll content",
            },
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          expect(mockUpdateDllHandler).toHaveBeenCalled();
        });
      });

      it("should not create DLL when projectId is not available", async () => {
        mockUseAtom.mockImplementation((atom: any) => {
          if (atom === DLL_LIST_ATOM) return [[], vi.fn()];
          if (atom === CURRENT_PROJECT_ATOM) return [null, vi.fn()];
          if (atom === RESTART_POD_SERVER_ATOM) return [null, vi.fn()];
          return [undefined, vi.fn()];
        });

        const user = userEvent.setup();
        renderWithProviders(<DllTable />);

        const createButton = screen.getByTestId("create-dll-button");
        await user.click(createButton);

        expect(request.plugins.addPlugins).not.toHaveBeenCalled();
      });
    });

    describe("Edit Operation", () => {
      it("should edit an existing DLL successfully", async () => {
        const user = userEvent.setup();
        renderWithProviders(<DllTable />);

        await waitFor(() => {
          expect(screen.getByTestId("edit-dll-dll-1")).toBeInTheDocument();
        });

        const editButton = screen.getByTestId("edit-dll-dll-1");
        await user.click(editButton);

        await waitFor(() => {
          expect(request.plugins.updatePlugins).toHaveBeenCalledWith({
            query: "dll-1",
            data: { code: "updated dll content" },
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          expect(mockUpdateDllHandler).toHaveBeenCalled();
        });
      });
    });

    describe("Delete Operation", () => {
      it("should delete a DLL successfully", async () => {
        const user = userEvent.setup();
        renderWithProviders(<DllTable />);

        await waitFor(() => {
          expect(screen.getByTestId("delete-dll-dll-1")).toBeInTheDocument();
        });

        const deleteButton = screen.getByTestId("delete-dll-dll-1");
        await user.click(deleteButton);

        await waitFor(() => {
          expect(request.plugins.deletePlugins).toHaveBeenCalledWith({
            query: "dll-1",
          });
          expect(mockToast).toHaveBeenCalledWith({
            description: "successfully deleted",
          });
          expect(mockUpdateDllHandler).toHaveBeenCalled();
        });
      });

      it("should handle delete operation errors", async () => {
        const errorMessage = "Delete failed";
        (request.plugins.deletePlugins as any).mockRejectedValue(
          new Error(errorMessage),
        );
        (handleErrorMessage as any).mockReturnValue("Processed error message");

        const user = userEvent.setup();
        renderWithProviders(<DllTable />);

        await waitFor(() => {
          expect(screen.getByTestId("delete-dll-dll-1")).toBeInTheDocument();
        });

        const deleteButton = screen.getByTestId("delete-dll-dll-1");
        await user.click(deleteButton);

        await waitFor(() => {
          expect(request.plugins.deletePlugins).toHaveBeenCalled();
          expect(handleErrorMessage).toHaveBeenCalledWith(expect.any(Error));
          expect(mockToast).toHaveBeenCalledWith({
            description: "Processed error message",
          });
        });
      });
    });
  });

  describe("Data Processing", () => {
    it("should correctly process table data with operations", async () => {
      renderWithProviders(<DllTable />);

      await waitFor(() => {
        // Verify that both DLL items are rendered with their operations
        expect(screen.getByTestId("dll-item-dll-1")).toBeInTheDocument();
        expect(screen.getByTestId("dll-item-dll-2")).toBeInTheDocument();

        // Check that delete and edit buttons are rendered for each item
        expect(screen.getByTestId("delete-dll-dll-1")).toBeInTheDocument();
        expect(screen.getByTestId("delete-dll-dll-2")).toBeInTheDocument();
        expect(screen.getByTestId("edit-dll-dll-1")).toBeInTheDocument();
        expect(screen.getByTestId("edit-dll-dll-2")).toBeInTheDocument();
      });
    });

    it("should handle null or undefined DLL list", async () => {
      mockUseAtom.mockImplementation((atom: any) => {
        if (atom === DLL_LIST_ATOM) return [null, vi.fn()];
        if (atom === CURRENT_PROJECT_ATOM) return [mockProjectId, vi.fn()];
        if (atom === RESTART_POD_SERVER_ATOM) return [null, vi.fn()];
        return [undefined, vi.fn()];
      });

      renderWithProviders(<DllTable />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
      });

      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    });

    it("should handle empty DLL list", async () => {
      mockUseAtom.mockImplementation((atom: any) => {
        if (atom === DLL_LIST_ATOM) return [[], vi.fn()];
        if (atom === CURRENT_PROJECT_ATOM) return [mockProjectId, vi.fn()];
        if (atom === RESTART_POD_SERVER_ATOM) return [null, vi.fn()];
        return [undefined, vi.fn()];
      });

      renderWithProviders(<DllTable />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
      });

      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    });
  });

  describe("Props and Styling", () => {
    it("should apply correct CSS classes", () => {
      renderWithProviders(<DllTable />);

      const dllTitle = screen.getByText("dll");
      expect(dllTitle).toHaveClass("gradient-text-class");
    });

    it("should pass correct props to DataTable", async () => {
      renderWithProviders(<DllTable />);

      const dataTable = screen.getByTestId("dll-table");
      expect(dataTable).toHaveAttribute("data-testid", "dll-table");

      await waitFor(() => {
        expect(dataTable).toHaveClass("min-w-[600px]");
      });
    });

    it("should not apply min-width class when loading or no data", () => {
      mockUseAtom.mockImplementation((atom: any) => {
        if (atom === DLL_LIST_ATOM) return [[], vi.fn()];
        if (atom === CURRENT_PROJECT_ATOM) return [mockProjectId, vi.fn()];
        if (atom === RESTART_POD_SERVER_ATOM) return [null, vi.fn()];
        return [undefined, vi.fn()];
      });

      renderWithProviders(<DllTable />);

      const dataTable = screen.getByTestId("dll-table");
      expect(dataTable).not.toHaveClass("min-w-[600px]");
    });
  });

  describe("Edge Cases", () => {
    it("should handle FormData operations correctly", async () => {
      mockUseAtom.mockImplementation((atom: any) => {
        if (atom === DLL_LIST_ATOM) return [mockDllList, vi.fn()];
        if (atom === CURRENT_PROJECT_ATOM) return [mockProjectId, vi.fn()];
        if (atom === RESTART_POD_SERVER_ATOM) return [null, vi.fn()];
        return [undefined, vi.fn()];
      });

      const user = userEvent.setup();
      renderWithProviders(<DllTable />);

      const createButton = screen.getByTestId("create-dll-button");
      await user.click(createButton);

      await waitFor(() => {
        expect(request.plugins.addPlugins).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              projectId: mockProjectId,
              code: "test dll content",
            }),
          }),
        );
      });
    });
  });

  describe("Async Operations", () => {
    beforeEach(() => {
      mockUseAtom.mockImplementation((atom: any) => {
        if (atom === DLL_LIST_ATOM) return [mockDllList, vi.fn()];
        if (atom === CURRENT_PROJECT_ATOM) return [mockProjectId, vi.fn()];
        if (atom === RESTART_POD_SERVER_ATOM) return [null, vi.fn()];
        return [undefined, vi.fn()];
      });
    });

    it("should handle concurrent operations", async () => {
      const user = userEvent.setup();
      renderWithProviders(<DllTable />);

      await waitFor(() => {
        expect(screen.getByTestId("create-dll-button")).toBeInTheDocument();
        expect(screen.getByTestId("delete-dll-dll-1")).toBeInTheDocument();
      });

      // Simulate multiple quick clicks
      const createButton = screen.getByTestId("create-dll-button");
      const deleteButton = screen.getByTestId("delete-dll-dll-1");

      await user.click(createButton);
      await user.click(deleteButton);

      await waitFor(() => {
        expect(request.plugins.addPlugins).toHaveBeenCalled();
        expect(request.plugins.deletePlugins).toHaveBeenCalled();
      });
    });

    it("should maintain loading state during operations", async () => {
      let resolveCreate: (value: any) => void = () => {};
      const createPromise = new Promise((resolve) => {
        resolveCreate = resolve;
      });

      (request.plugins.addPlugins as any).mockReturnValue(createPromise);

      const user = userEvent.setup();
      renderWithProviders(<DllTable />);

      const createButton = screen.getByTestId("create-dll-button");
      await user.click(createButton);

      // Resolve the promise
      resolveCreate(undefined);

      await waitFor(() => {
        expect(mockUpdateDllHandler).toHaveBeenCalled();
      });
    });
  });

  describe("Integration with Hooks", () => {
    it("should integrate properly with useUpdateDllList hook", async () => {
      renderWithProviders(<DllTable />);

      await waitFor(() => {
        expect(useUpdateDllList).toHaveBeenCalled();
        expect(mockUpdateDllHandler).toHaveBeenCalledWith(mockProjectId);
      });
    });

    it("should integrate properly with useToast hook", async () => {
      mockUseAtom.mockImplementation((atom: any) => {
        if (atom === DLL_LIST_ATOM) return [mockDllList, vi.fn()];
        if (atom === CURRENT_PROJECT_ATOM) return [mockProjectId, vi.fn()];
        if (atom === RESTART_POD_SERVER_ATOM) return [null, vi.fn()];
        return [undefined, vi.fn()];
      });

      const user = userEvent.setup();
      renderWithProviders(<DllTable />);

      await waitFor(() => {
        expect(screen.getByTestId("delete-dll-dll-1")).toBeInTheDocument();
      });

      const deleteButton = screen.getByTestId("delete-dll-dll-1");
      await user.click(deleteButton);

      await waitFor(() => {
        expect(useToast).toHaveBeenCalled();
        expect(mockToast).toHaveBeenCalledWith({
          description: "successfully deleted",
        });
      });
    });

    it("should integrate properly with jotai atoms", () => {
      renderWithProviders(<DllTable />);

      expect(mockUseAtom).toHaveBeenCalledWith(DLL_LIST_ATOM);
      expect(mockUseAtom).toHaveBeenCalledWith(CURRENT_PROJECT_ATOM);
      expect(mockUseAtom).toHaveBeenCalledWith(RESTART_POD_SERVER_ATOM);
    });
  });

  describe("Component State Management", () => {
    it("should handle loading state correctly", async () => {
      renderWithProviders(<DllTable />);

      // Component should start loading and then stop
      await waitFor(() => {
        expect(mockUpdateDllHandler).toHaveBeenCalled();
      });
    });

    it("should handle different load statuses", async () => {
      const mockDllListWithDifferentStatuses: IDllPlugin[] = [
        {
          id: "dll-error",
          name: "error-dll.dll",
          creationTime: 1640995200000,
          lastModificationTime: 1640995200000,
          lastModifierName: "Test User",
          creatorName: "Test User",
          loadStatus: ELoadStatus.OtherError,
          reason: "Test error reason",
        },
      ];

      mockUseAtom.mockImplementation((atom: any) => {
        if (atom === DLL_LIST_ATOM)
          return [mockDllListWithDifferentStatuses, vi.fn()];
        if (atom === CURRENT_PROJECT_ATOM) return [mockProjectId, vi.fn()];
        if (atom === RESTART_POD_SERVER_ATOM) return [null, vi.fn()];
        return [undefined, vi.fn()];
      });

      renderWithProviders(<DllTable />);

      await waitFor(() => {
        expect(screen.getByTestId("dll-item-dll-error")).toBeInTheDocument();
      });
    });
  });
});
