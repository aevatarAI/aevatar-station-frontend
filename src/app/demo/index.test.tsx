import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DemoPage from "./index";

// Mock the API
vi.mock("@/api", () => ({
  request: {
    organizations: {
      getUserOrganizations: vi.fn(),
    },
  },
}));

// Mock the hooks
const mockToggleTheme = vi.fn();

vi.mock("@/hooks/useTheme", () => ({
  useTheme: () => ({
    theme: "light",
    toggleTheme: mockToggleTheme,
  }),
}));

// Mock jotai
const mockSetValue = vi.fn();

vi.mock("jotai", () => ({
  useAtom: () => ["test-value", mockSetValue],
}));

// Mock the UI components
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, variant, className }: any) => (
    <button
      type="button"
      data-testid="button"
      onClick={onClick}
      data-variant={variant}
      className={className}
    >
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: ({ value, onChange, className, type }: any) => (
    <input
      data-testid="input"
      value={value}
      onChange={onChange}
      className={className}
      type={type}
    />
  ),
}));

vi.mock("@/components/ui/table", () => ({
  Table: ({ children }: any) => <table data-testid="table">{children}</table>,
  TableBody: ({ children }: any) => (
    <tbody data-testid="table-body">{children}</tbody>
  ),
  TableCell: ({ children }: any) => (
    <td data-testid="table-cell">{children}</td>
  ),
  TableHead: ({ children }: any) => (
    <th data-testid="table-head">{children}</th>
  ),
  TableHeader: ({ children }: any) => (
    <thead data-testid="table-header">{children}</thead>
  ),
  TableRow: ({ children }: any) => <tr data-testid="table-row">{children}</tr>,
}));

// Mock console.log
const mockConsoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

describe("DemoPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the demo page with all sections", () => {
    render(<DemoPage />);

    // Check for main sections
    expect(screen.getByText("How to use Atom")).toBeInTheDocument();
    expect(screen.getByText("How to use request")).toBeInTheDocument();
    expect(screen.getByText("Table Border Styles")).toBeInTheDocument();
  });

  it("should render atom input section", () => {
    render(<DemoPage />);

    expect(screen.getByText("Input: test-value")).toBeInTheDocument();
    expect(screen.getByTestId("input")).toBeInTheDocument();
  });

  it("should render request section with button", () => {
    render(<DemoPage />);

    const button = screen.getByText("Get User Organizations");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-testid", "button");
  });

  it("should render table demo section", () => {
    render(<DemoPage />);

    expect(screen.getByText("Table with Borders")).toBeInTheDocument();
    expect(screen.getByTestId("table")).toBeInTheDocument();
    expect(screen.getByText("Current Theme: 🌞 Light")).toBeInTheDocument();
  });

  it("should render sample data in table", () => {
    render(<DemoPage />);

    // Check table headers
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Domain")).toBeInTheDocument();
    expect(screen.getByText("Members")).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();

    // Check sample data
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("2025-01-21")).toBeInTheDocument();

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("2025-01-20")).toBeInTheDocument();

    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("2025-01-19")).toBeInTheDocument();
  });

  it("should render border features description", () => {
    render(<DemoPage />);

    expect(screen.getByText("Border Features:")).toBeInTheDocument();
    expect(
      screen.getByText("Table outer border with rounded corners"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Header bottom separator line"),
    ).toBeInTheDocument();
    expect(screen.getByText("Row bottom separator lines")).toBeInTheDocument();
    expect(
      screen.getByText("Automatic theme-aware border colors"),
    ).toBeInTheDocument();
    expect(screen.getByText("Hover effects on rows")).toBeInTheDocument();
  });

  it("should handle input change", () => {
    render(<DemoPage />);

    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "new value" } });

    expect(mockSetValue).toHaveBeenCalledWith("new value");
  });

  it("should handle button click for API request", async () => {
    render(<DemoPage />);

    const button = screen.getByText("Get User Organizations");
    fireEvent.click(button);

    const { request } = await import("@/api");
    expect(request.organizations.getUserOrganizations).toHaveBeenCalled();
  });

  it("should handle theme toggle button click", () => {
    render(<DemoPage />);

    const themeButton = screen.getByText("Current Theme: 🌞 Light");
    fireEvent.click(themeButton);

    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it("should log demo page message", () => {
    render(<DemoPage />);

    expect(mockConsoleLog).toHaveBeenCalledWith("demo page");
  });

  it("should render with correct CSS classes", () => {
    render(<DemoPage />);

    const container = screen.getByText("How to use Atom").closest("div")
      ?.parentElement?.parentElement;
    expect(container).toHaveClass(
      "container",
      "mx-auto",
      "p-10",
      "flex",
      "gap-4",
      "flex-col",
    );
  });

  it("should render input with correct props", () => {
    render(<DemoPage />);

    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveValue("test-value");
    expect(input).toHaveClass("w-[200px]", "text-[var(--color-foreground)]");
  });

  it("should render theme button with correct variant", () => {
    render(<DemoPage />);

    const themeButton = screen.getByText("Current Theme: 🌞 Light");
    expect(themeButton).toHaveAttribute("data-variant", "outline");
  });

  it("should render table with proper structure", () => {
    render(<DemoPage />);

    expect(screen.getByTestId("table")).toBeInTheDocument();
    expect(screen.getByTestId("table-header")).toBeInTheDocument();
    expect(screen.getByTestId("table-body")).toBeInTheDocument();
  });

  it("should render all table rows", () => {
    render(<DemoPage />);

    const tableRows = screen.getAllByTestId("table-row");
    expect(tableRows).toHaveLength(4); // 1 header + 3 data rows
  });

  it("should render table cells with correct data", () => {
    render(<DemoPage />);

    const tableCells = screen.getAllByTestId("table-cell");
    expect(tableCells).toHaveLength(12); // 3 rows × 4 columns
  });
});
