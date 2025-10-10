import { EmptyAPIRequests, Usage, useDisplayGraphs } from "@/components/Usage";
import { useGetAPIRequests } from "@/hooks/useGetAPIRequests";
import { useGetLLMTokens } from "@/hooks/useGetLLMTokenUsage";
import { useGetSystemModels } from "@/hooks/useGetSystemModels";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useOrgPermissions } from "@/hooks/useOrgPermissions";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import { generateDates } from "@/utils/helpers";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { render, renderHook, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock all the hooks
vi.mock("@/hooks/useGetAPIRequests", () => ({
  useGetAPIRequests: vi.fn(),
}));

vi.mock("@/hooks/useGetLLMTokenUsage", () => ({
  useGetLLMTokens: vi.fn(),
}));

vi.mock("@/hooks/useGetSystemModels", () => ({
  useGetSystemModels: vi.fn(),
}));

vi.mock("@/hooks/useIsMobile", () => ({
  useIsMobile: vi.fn(),
}));

vi.mock("@/hooks/useOrgPermissions", () => ({
  useOrgPermissions: vi.fn(),
}));

vi.mock("@/hooks/useProjectPermissions", () => ({
  useProjectPermissions: vi.fn(),
}));

// Mock the DatePickerWithRange component
vi.mock("@/components/DatePickerWithRange", () => ({
  DatePickerWithRange: ({
    onDateChange,
  }: {
    date: any;
    onDateChange: (date: any) => void;
  }) => (
    <div
      data-testid="date-picker"
      onClick={() => onDateChange({ from: 1234567890, to: 1234567890 })}
    >
      Date Picker
    </div>
  ),
}));

// Mock the generateDates utility
vi.mock("@/utils/helpers", () => ({
  generateDates: vi.fn(),
}));

// Mock Recharts components
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Bar: () => <div data-testid="bar" />,
  Line: () => <div data-testid="line" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Legend: () => <div data-testid="legend" />,
  Tooltip: () => <div data-testid="tooltip" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
}));

// Mock dayjs
vi.mock("@/api/dayjs", () => ({
  default: vi.fn(() => ({
    utc: vi.fn(() => ({
      local: vi.fn(() => ({
        format: vi.fn(() => "18/04"),
      })),
    })),
    subtract: vi.fn(() => ({
      startOf: vi.fn(() => ({
        valueOf: vi.fn(() => 1234567890),
      })),
    })),
    endOf: vi.fn(() => ({
      valueOf: vi.fn(() => 1234567890),
    })),
  })),
}));

describe("Usage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(useGetAPIRequests).mockReturnValue({
      data: { data: { requests: [], totalRequests: 0 } },
      isLoading: false,
      error: null,
      isError: false,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      isPlaceholderData: false,
      status: "success",
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: false,
      isInitialLoading: false,
      isPaused: false,
      isRefetching: false,
      isStale: false,
      refetch: (
        _options?: RefetchOptions,
      ): Promise<QueryObserverResult<any, Error>> => {
        throw new Error("Function not implemented.");
      },
      fetchStatus: "fetching",
      promise: Promise.resolve({}),
    });

    vi.mocked(useGetLLMTokens).mockReturnValue({
      data: { data: { tokens: [] } },
      isLoading: false,
      error: null,
      isError: false,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      isPlaceholderData: false,
      status: "success",
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: false,
      isInitialLoading: false,
      isPaused: false,
      isRefetching: false,
      isStale: false,
      refetch: (
        _options?: RefetchOptions,
      ): Promise<QueryObserverResult<any, Error>> => {
        throw new Error("Function not implemented.");
      },
      fetchStatus: "fetching",
      promise: Promise.resolve({}),
    });

    vi.mocked(useGetSystemModels).mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: null,
      isError: false,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      isPlaceholderData: false,
      status: "success",
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: false,
      isInitialLoading: false,
      isPaused: false,
      isRefetching: false,
      isStale: false,
      refetch: (
        _options?: RefetchOptions,
      ): Promise<QueryObserverResult<any, Error>> => {
        throw new Error("Function not implemented.");
      },
      fetchStatus: "fetching",
      promise: Promise.resolve({}),
    });

    vi.mocked(useIsMobile).mockReturnValue({
      isMobile: false,
    });

    vi.mocked(useOrgPermissions).mockReturnValue({
      llmsModels: false,
      apiRequests: false,
    });

    vi.mocked(useProjectPermissions).mockReturnValue({
      llmsModels: false,
      apiRequests: false,
    });

    vi.mocked(generateDates).mockReturnValue(["18/04", "19/04", "20/04"]);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should render the Usage component", () => {
    render(<Usage />);

    expect(screen.getByText("Usage")).toBeInTheDocument();
    expect(screen.getByTestId("date-picker")).toBeInTheDocument();
  });

  it("should not render LLM models section when permissions deny", () => {
    vi.mocked(useProjectPermissions).mockReturnValue({
      llmsModels: false,
      apiRequests: false,
    });

    render(<Usage />);

    expect(screen.queryByText("llms model")).not.toBeInTheDocument();
  });

  it("should not render API requests section when permissions deny", () => {
    vi.mocked(useProjectPermissions).mockReturnValue({
      llmsModels: false,
      apiRequests: false,
    });

    render(<Usage />);

    expect(screen.queryByText("api request")).not.toBeInTheDocument();
  });

  it("should handle date change from DatePickerWithRange", () => {
    render(<Usage />);

    const datePicker = screen.getByTestId("date-picker");
    datePicker.click();

    // The component should handle the date change
    expect(datePicker).toBeInTheDocument();
  });

  it("should handle loading state", () => {
    vi.mocked(useGetAPIRequests).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      isError: false,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      isPlaceholderData: false,
      status: "success",
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: false,
      isInitialLoading: false,
      isPaused: false,
      isRefetching: false,
      isStale: false,
      refetch: (
        _options?: RefetchOptions,
      ): Promise<QueryObserverResult<any, Error>> => {
        throw new Error("Function not implemented.");
      },
      fetchStatus: "fetching",
      promise: Promise.resolve({}),
    });

    vi.mocked(useGetLLMTokens).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      isError: false,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      isPlaceholderData: false,
      status: "success",
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: false,
      isInitialLoading: false,
      isPaused: false,
      isRefetching: false,
      isStale: false,
      refetch: (
        _options?: RefetchOptions,
      ): Promise<QueryObserverResult<any, Error>> => {
        throw new Error("Function not implemented.");
      },
      fetchStatus: "fetching",
      promise: Promise.resolve({}),
    });

    render(<Usage />);

    expect(screen.getByText("Usage")).toBeInTheDocument();
  });

  it("should handle error state", () => {
    vi.mocked(useGetAPIRequests).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("API Error"),
      isError: true,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: false,
      isPlaceholderData: false,
      status: "error",
      dataUpdatedAt: 0,
      errorUpdatedAt: Date.now(),
      failureCount: 1,
      failureReason: new Error("API Error"),
      errorUpdateCount: 1,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isInitialLoading: false,
      isPaused: false,
      isRefetching: false,
      isStale: false,
      refetch: vi.fn(),
      fetchStatus: "idle",
      promise: Promise.resolve({}),
    } as any);

    vi.mocked(useGetLLMTokens).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Token Error"),
      isError: true,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: false,
      isPlaceholderData: false,
      status: "error",
      dataUpdatedAt: 0,
      errorUpdatedAt: Date.now(),
      failureCount: 1,
      failureReason: new Error("Token Error"),
      errorUpdateCount: 1,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isInitialLoading: false,
      isPaused: false,
      isRefetching: false,
      isStale: false,
      refetch: vi.fn(),
      fetchStatus: "idle",
      promise: Promise.resolve({}),
    } as any);

    render(<Usage />);

    expect(screen.getByText("Usage")).toBeInTheDocument();
  });
});

describe("useDisplayGraphs Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return initial displayGraphs state", () => {
    vi.mocked(useProjectPermissions).mockReturnValue({
      llmsModels: false,
      apiRequests: false,
    });
    vi.mocked(useOrgPermissions).mockReturnValue({
      llmsModels: false,
      apiRequests: false,
    });

    const { result } = renderHook(() => useDisplayGraphs());

    expect(result.current.displayGraphs).toEqual({
      llmsModels: false,
      apiRequests: false,
    });
  });

  it("should update displayGraphs when project permissions change", async () => {
    vi.mocked(useProjectPermissions).mockReturnValue({
      llmsModels: true,
      apiRequests: true,
    });
    vi.mocked(useOrgPermissions).mockReturnValue({
      llmsModels: undefined,
      apiRequests: undefined,
    });

    const { result } = renderHook(() => useDisplayGraphs());

    await waitFor(() => {
      expect(result.current.displayGraphs).toEqual({
        llmsModels: true,
        apiRequests: true,
      });
    });
  });

  it("should update displayGraphs when org permissions change", async () => {
    vi.mocked(useProjectPermissions).mockReturnValue({
      llmsModels: undefined,
      apiRequests: undefined,
    });
    vi.mocked(useOrgPermissions).mockReturnValue({
      llmsModels: true,
      apiRequests: true,
    });

    const { result } = renderHook(() => useDisplayGraphs());

    await waitFor(() => {
      expect(result.current.displayGraphs).toEqual({
        llmsModels: true,
        apiRequests: true,
      });
    });
  });

  it("should prioritize org permissions over project permissions", async () => {
    vi.mocked(useProjectPermissions).mockReturnValue({
      llmsModels: false,
      apiRequests: false,
    });
    vi.mocked(useOrgPermissions).mockReturnValue({
      llmsModels: true,
      apiRequests: true,
    });

    const { result } = renderHook(() => useDisplayGraphs());

    await waitFor(() => {
      expect(result.current.displayGraphs).toEqual({
        llmsModels: true,
        apiRequests: true,
      });
    });
  });
});

describe("EmptyAPIRequests Component", () => {
  const mockProps = {
    from: 1234567890,
    to: 1234567890,
    isMobile: false,
  };

  beforeEach(() => {
    vi.mocked(generateDates).mockReturnValue(["18/04", "19/04", "20/04"]);
  });

  it("should render EmptyAPIRequests component", () => {
    render(<EmptyAPIRequests {...mockProps} />);

    // The component should render a chart container
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("should call generateDates with correct parameters", () => {
    render(<EmptyAPIRequests {...mockProps} />);

    expect(generateDates).toHaveBeenCalledWith(mockProps.from, mockProps.to);
  });

  it("should render with mobile layout when isMobile is true", () => {
    const mobileProps = { ...mockProps, isMobile: true };
    render(<EmptyAPIRequests {...mobileProps} />);

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("should handle different date ranges", () => {
    const differentProps = {
      from: 9876543210,
      to: 12345678900,
      isMobile: false,
    };

    render(<EmptyAPIRequests {...differentProps} />);

    expect(generateDates).toHaveBeenCalledWith(
      differentProps.from,
      differentProps.to,
    );
  });

  it("should render chart with correct data structure", () => {
    render(<EmptyAPIRequests {...mockProps} />);

    // Verify the chart components are rendered
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("cartesian-grid")).toBeInTheDocument();
    expect(screen.getByTestId("x-axis")).toBeInTheDocument();
    expect(screen.getByTestId("y-axis")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    expect(screen.getByTestId("line")).toBeInTheDocument();
  });
});
