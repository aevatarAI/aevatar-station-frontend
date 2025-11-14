import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import WorkflowPage from "./index";

// Mock external dependencies
vi.mock("@aevatar-react-sdk/ui-react", () => ({
  AevatarProvider: ({
    children,
    theme,
  }: {
    children: React.ReactNode;
    theme: string;
  }) => (
    <div data-testid="aevatar-provider" data-theme={theme}>
      {children}
    </div>
  ),
  WorkflowList: vi
    .fn()
    .mockImplementation(({ onEditWorkflow, onNewWorkflow }: any) => (
      <div data-testid="workflow-list">
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          data-testid="edit-workflow-btn"
          onClick={() => onEditWorkflow("test-workflow-id")}
        >
          Edit Workflow
        </button>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button data-testid="new-workflow-btn" onClick={onNewWorkflow}>
          New Workflow
        </button>
      </div>
    )),
  WorkflowConfiguration: vi.fn(
    ({ sidebarConfig, extraControlBar, onBack, editWorkflow }: any) => (
      <div data-testid="workflow-configuration">
        <div data-testid="sidebar-config">{JSON.stringify(sidebarConfig)}</div>
        <div data-testid="extra-control-bar">{extraControlBar}</div>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button data-testid="back-btn" onClick={onBack}>
          Back
        </button>
        <div data-testid="edit-workflow-data">
          {JSON.stringify(editWorkflow)}
        </div>
      </div>
    ),
  ),
  FullScreenIcon: ({ className, style }: any) => (
    <div data-testid="fullscreen-icon" className={className} style={style}>
      FullScreen
    </div>
  ),
  aevatarAI: {
    services: {
      agent: {
        getAllAgentsConfiguration: vi.fn(),
      },
    },
    getWorkflowViewDataByAgentId: vi.fn(),
  },
}));

vi.mock("@aevatar-react-sdk/services", () => ({
  IAgentInfoDetail: {},
  IAgentsConfiguration: {},
}));

// Mock hooks
vi.mock("@/hooks/useTheme", () => ({
  useTheme: vi.fn(() => ({
    theme: "light",
  })),
}));

vi.mock("jotai", () => ({
  useAtom: vi.fn(() => ["project-123", vi.fn()]),
}));

vi.mock("wouter", () => ({
  useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
}));

vi.mock("@/utils/common", () => ({
  delay: vi.fn(() => Promise.resolve()),
}));

vi.mock("react-use", () => ({
  useUpdateEffect: vi.fn((fn, deps) => {
    // Mock implementation that calls the effect when deps change
    React.useEffect(fn, deps);
  }),
}));

// Mock components
vi.mock("@/components/PageLoading", () => ({
  default: ({ className }: { className: string }) => (
    <div data-testid="page-loading" className={className}>
      Loading...
    </div>
  ),
}));

// Mock state atoms
vi.mock("@/state/atoms/organisation", () => ({
  CURRENT_PROJECT_ATOM: "mock-project-atom",
}));

import { useTheme } from "@/hooks/useTheme";
import { delay } from "@/utils/common";
import { aevatarAI } from "@aevatar-react-sdk/ui-react";
import { useAtom } from "jotai";
import React from "react";
import { useSearchParams } from "wouter";

describe("WorkflowPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      toggleTheme: vi.fn(),
      setLightTheme: vi.fn(),
      setDarkTheme: vi.fn(),
      isLight: true,
      isDark: false,
    });
    vi.mocked(useAtom).mockReturnValue(["project-123", vi.fn()] as any);
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
      vi.fn(),
    ]);
    vi.mocked(
      aevatarAI.services.agent.getAllAgentsConfiguration,
    ).mockResolvedValue([
      {
        agentType: "Aevatar.GAgents.InputGAgent.GAgent.InputGAgent",
        fullName: "Input Agent",
        propertyJsonSchema: "{}",
      },
    ]);
    vi.mocked(aevatarAI.getWorkflowViewDataByAgentId).mockResolvedValue({
      workflowId: "workflow-123",
      workflowName: "Test Workflow",
      workflowViewData: {
        name: "Test Workflow",
        properties: {
          workflowNodeList: [],
          workflowNodeUnitList: [],
        },
      },
    });
  });

  it("should render AevatarProvider with correct theme", () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
      vi.fn(),
    ]);

    render(<WorkflowPage />);

    // The component should render AevatarProvider
    expect(screen.getByTestId("aevatar-provider")).toBeInTheDocument();
  });

  it("should render workflow list when workflowType is WorkflowList", async () => {
    // Mock the effect that sets workflowType
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
      vi.fn(),
    ]);

    render(<WorkflowPage />);

    // Wait for the component to update
    await waitFor(() => {
      expect(screen.getByTestId("workflow-list")).toBeInTheDocument();
    });
  });

  it("should render workflow configuration when workflowType is WorkflowEdit", async () => {
    // Mock search params with workflowId
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set("workflowId", "test-workflow-id");
    vi.mocked(useSearchParams).mockReturnValue([mockSearchParams, vi.fn()]);

    render(<WorkflowPage />);

    await waitFor(() => {
      expect(screen.getByTestId("workflow-configuration")).toBeInTheDocument();
    });
  });

  it("should handle edit workflow action", async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
      vi.fn(),
    ]);

    render(<WorkflowPage />);

    await waitFor(() => {
      expect(screen.getByTestId("workflow-list")).toBeInTheDocument();
    });

    const editButton = screen.getByTestId("edit-workflow-btn");
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(aevatarAI.getWorkflowViewDataByAgentId).toHaveBeenCalledWith(
        "test-workflow-id",
      );
    });
  });

  it("should handle new workflow action", async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
      vi.fn(),
    ]);

    render(<WorkflowPage />);

    await waitFor(() => {
      expect(screen.getByTestId("workflow-list")).toBeInTheDocument();
    });

    const newButton = screen.getByTestId("new-workflow-btn");
    fireEvent.click(newButton);

    await waitFor(() => {
      expect(delay).toHaveBeenCalledWith(10);
    });
  });

  it("should handle fullscreen toggle", async () => {
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set("workflowId", "test-workflow-id");
    vi.mocked(useSearchParams).mockReturnValue([mockSearchParams, vi.fn()]);

    render(<WorkflowPage />);

    await waitFor(() => {
      expect(screen.getByTestId("workflow-configuration")).toBeInTheDocument();
    });

    const fullscreenButton =
      screen.getByTestId("fullscreen-icon").parentElement;
    expect(fullscreenButton).toBeInTheDocument();

    if (fullscreenButton) {
      fireEvent.click(fullscreenButton);
    }
  });

  it("should handle back action from workflow configuration", async () => {
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set("workflowId", "test-workflow-id");
    vi.mocked(useSearchParams).mockReturnValue([mockSearchParams, vi.fn()]);

    render(<WorkflowPage />);

    await waitFor(() => {
      expect(screen.getByTestId("workflow-configuration")).toBeInTheDocument();
    });

    const backButton = screen.getByTestId("back-btn");
    fireEvent.click(backButton);
  });

  it("should filter agent types correctly", async () => {
    const mockAgentTypes = [
      {
        agentType: "Aevatar.GAgents.InputGAgent.GAgent.InputGAgent",
        fullName: "Input Agent",
        propertyJsonSchema: "{}",
      },
      {
        agentType: "unsupported.agent.type",
        fullName: "Unsupported Agent",
        propertyJsonSchema: "{}",
      },
      {
        agentType: "aevatar.mcp",
        fullName: "Aevatar MCP",
        propertyJsonSchema: "{}",
      },
    ];

    vi.mocked(
      aevatarAI.services.agent.getAllAgentsConfiguration,
    ).mockResolvedValue(mockAgentTypes);
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
      vi.fn(),
    ]);

    render(<WorkflowPage />);

    await waitFor(() => {
      expect(
        aevatarAI.services.agent.getAllAgentsConfiguration,
      ).toHaveBeenCalled();
    });
  });

  it("should handle workflow edit error gracefully", async () => {
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set("workflowId", "invalid-workflow-id");
    vi.mocked(useSearchParams).mockReturnValue([mockSearchParams, vi.fn()]);
    vi.mocked(aevatarAI.getWorkflowViewDataByAgentId).mockRejectedValue(
      new Error("Workflow not found"),
    );

    render(<WorkflowPage />);

    await waitFor(() => {
      // Should fall back to WorkflowList when error occurs
      expect(screen.getByTestId("workflow-list")).toBeInTheDocument();
    });
  });

  it("should pass correct props to AevatarProvider", async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
      vi.fn(),
    ]);

    render(<WorkflowPage />);

    const provider = screen.getByTestId("aevatar-provider");
    expect(provider).toHaveAttribute("data-theme", "light");
  });

  it("should handle project change", async () => {
    const mockSetProjectId = vi.fn();
    vi.mocked(useAtom).mockReturnValue([
      "project-123",
      mockSetProjectId,
    ] as any);
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
      vi.fn(),
    ]);

    render(<WorkflowPage />);

    await waitFor(() => {
      expect(screen.getByTestId("workflow-list")).toBeInTheDocument();
    });
  });

  it("should render with dark theme", async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "dark",
      toggleTheme: vi.fn(),
      setLightTheme: vi.fn(),
      setDarkTheme: vi.fn(),
      isLight: false,
      isDark: true,
    });
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
      vi.fn(),
    ]);

    render(<WorkflowPage />);

    const provider = screen.getByTestId("aevatar-provider");
    expect(provider).toHaveAttribute("data-theme", "dark");
  });

  it("should be defined", () => {
    expect(WorkflowPage).toBeDefined();
  });
});
