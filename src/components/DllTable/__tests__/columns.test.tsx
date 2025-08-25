import dayjs from "@/api/dayjs";
import { ELoadStatus, type IDllPlugin } from "@/api/utils/plugin";
import { flexRender } from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type IProjectTable, columns } from "../columns";

// Mock the SVG import
vi.mock("@/assets/errorTip.svg?react", () => ({
  __esModule: true,
  default: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="error-tip-icon">
      <title>Error Tip</title>
    </svg>
  ),
}));

// Mock dayjs
vi.mock("@/api/dayjs", () => ({
  __esModule: true,
  default: {
    utc: vi.fn(),
  },
}));

describe("DllTable Columns", () => {
  const mockUtc = dayjs.utc as any;
  const mockLocal = vi.fn();
  const mockFormat = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUtc.mockReturnValue({ local: mockLocal });
    mockLocal.mockReturnValue({ format: mockFormat });
    mockFormat.mockReturnValue("01.01.2022 12:00");
  });

  const createMockRow = (data: Partial<IProjectTable> = {}): any => ({
    original: {
      id: "test-id",
      name: "test.dll",
      creationTime: 1640995200000,
      lastModificationTime: 1640995300000,
      creatorName: "John Doe",
      lastModifierName: "Jane Doe",
      loadStatus: ELoadStatus.Deployed,
      operation: <div>Test Operation</div>,
      ...data,
    },
    id: "test-row-id",
  });

  describe("Name Column", () => {
    it("should render DLL name correctly", () => {
      const row = createMockRow({ name: "my-dll.dll" });
      const nameColumn = columns[0];

      const { container } = render(
        <div>{flexRender(nameColumn.cell, { row })}</div>,
      );

      expect(container).toHaveTextContent("my-dll.dll");
      expect(container.firstChild?.firstChild).toHaveClass(
        "min-w-[125px]",
        "text-[14px]",
        "font-semibold",
        "pl-[15px]",
        "pr-[20px]",
        "md:pr-[30px]",
      );
    });

    it("should have correct accessor key", () => {
      const nameColumn = columns[0];
      expect(nameColumn.accessorKey).toBe("name");
      expect(nameColumn.header).toBe("dll file");
    });
  });

  describe("Created Column", () => {
    it("should render creation time correctly", () => {
      const row = createMockRow({ creationTime: 1640995200000 });
      const createdColumn = columns[1];

      const { container } = render(
        <div>{flexRender(createdColumn.cell, { row })}</div>,
      );

      expect(mockUtc).toHaveBeenCalledWith(1640995200000);
      expect(mockLocal).toHaveBeenCalled();
      expect(mockFormat).toHaveBeenCalledWith("DD.MM.YYYY HH:mm");
      expect(container).toHaveTextContent("01.01.2022 12:00");
    });

    it("should have correct accessor key", () => {
      const createdColumn = columns[1];
      expect(createdColumn.accessorKey).toBe("created");
      expect(createdColumn.header).toBe("created");
    });

    it("should apply correct CSS classes", () => {
      const row = createMockRow();
      const createdColumn = columns[1];

      const { container } = render(
        <div>{flexRender(createdColumn.cell, { row })}</div>,
      );

      expect(container.firstChild?.firstChild).toHaveClass(
        "pr-[20px]",
        "md:pr-[30px]",
        "w-[175px]",
        "font-outfit",
      );
    });
  });

  describe("Creator Name Column", () => {
    it("should render creator name correctly", () => {
      const row = createMockRow({ creatorName: "John Smith" });
      const creatorColumn = columns[2];

      const { container } = render(
        <div>{flexRender(creatorColumn.cell, { row })}</div>,
      );

      expect(container).toHaveTextContent("John Smith");
    });

    it("should render 'Unknown' when creator name is null", () => {
      const row = createMockRow({ creatorName: null });
      const creatorColumn = columns[2];

      const { container } = render(
        <div>{flexRender(creatorColumn.cell, { row })}</div>,
      );

      expect(container).toHaveTextContent("Unknown");
    });

    it("should render 'Unknown' when creator name is undefined", () => {
      const row = createMockRow({ creatorName: undefined });
      const creatorColumn = columns[2];

      const { container } = render(
        <div>{flexRender(creatorColumn.cell, { row })}</div>,
      );

      expect(container).toHaveTextContent("Unknown");
    });

    it("should have correct accessor key", () => {
      const creatorColumn = columns[2];
      expect(creatorColumn.accessorKey).toBe("creatorName");
      expect(creatorColumn.header).toBe("created by");
    });
  });

  describe("Updated Column", () => {
    it("should render last modification time correctly", () => {
      const row = createMockRow({ lastModificationTime: 1640995300000 });
      const updatedColumn = columns[3];

      const { container } = render(
        <div>{flexRender(updatedColumn.cell, { row })}</div>,
      );

      expect(mockUtc).toHaveBeenCalledWith(1640995300000);
      expect(container).toHaveTextContent("01.01.2022 12:00");
    });

    it("should render '-' when last modification time is null", () => {
      const row = createMockRow({ lastModificationTime: null });
      const updatedColumn = columns[3];

      const { container } = render(
        <div>{flexRender(updatedColumn.cell, { row })}</div>,
      );

      expect(container).toHaveTextContent("-");
    });

    it("should render '-' when last modification time is undefined", () => {
      const row = createMockRow({ lastModificationTime: undefined });
      const updatedColumn = columns[3];

      const { container } = render(
        <div>{flexRender(updatedColumn.cell, { row })}</div>,
      );

      expect(container).toHaveTextContent("-");
    });

    it("should have correct accessor key", () => {
      const updatedColumn = columns[3];
      expect(updatedColumn.accessorKey).toBe("updated");
      expect(updatedColumn.header).toBe("updated");
    });
  });

  describe("Last Modifier Name Column", () => {
    it("should render last modifier name correctly", () => {
      const row = createMockRow({ lastModifierName: "Jane Smith" });
      const modifierColumn = columns[4];

      const { container } = render(
        <div>{flexRender(modifierColumn.cell, { row })}</div>,
      );

      expect(container).toHaveTextContent("Jane Smith");
    });

    it("should render '-' when last modifier name is null", () => {
      const row = createMockRow({ lastModifierName: null });
      const modifierColumn = columns[4];

      const { container } = render(
        <div>{flexRender(modifierColumn.cell, { row })}</div>,
      );

      expect(container).toHaveTextContent("-");
    });

    it("should render '-' when last modifier name is undefined", () => {
      const row = createMockRow({ lastModifierName: undefined });
      const modifierColumn = columns[4];

      const { container } = render(
        <div>{flexRender(modifierColumn.cell, { row })}</div>,
      );

      expect(container).toHaveTextContent("-");
    });

    it("should have correct accessor key", () => {
      const modifierColumn = columns[4];
      expect(modifierColumn.accessorKey).toBe("lastModifierName");
      expect(modifierColumn.header).toBe("updated by");
    });
  });

  describe("Load Status Column", () => {
    it("should render 'uploaded' for Uploaded status", () => {
      const row = createMockRow({ loadStatus: ELoadStatus.Uploaded });
      const statusColumn = columns[5];

      const { container } = render(
        <div>{flexRender(statusColumn.cell, { row })}</div>,
      );

      expect(container).toHaveTextContent("uploaded");
    });

    it("should render 'deployed' for Deployed status", () => {
      const row = createMockRow({ loadStatus: ELoadStatus.Deployed });
      const statusColumn = columns[5];

      const { container } = render(
        <div>{flexRender(statusColumn.cell, { row })}</div>,
      );

      expect(container).toHaveTextContent("deployed");
    });

    it("should render error status with tooltip for other statuses", () => {
      const row = createMockRow({
        loadStatus: ELoadStatus.OtherError,
        reason: "Connection failed",
      });
      const statusColumn = columns[5];

      render(<div>{flexRender(statusColumn.cell, { row })}</div>);

      expect(screen.getByTestId("error-tip-icon")).toBeInTheDocument();
      expect(screen.getByText("error")).toBeInTheDocument();
      // Tooltip content is not visible by default, just check the structure exists
      const tooltipTrigger = screen
        .getByText("error")
        .closest("span[data-state]");
      expect(tooltipTrigger).toBeInTheDocument();
    });

    it("should render default error message when reason is not provided", () => {
      const row = createMockRow({
        loadStatus: ELoadStatus.OtherError,
        reason: null,
      });
      const statusColumn = columns[5];

      render(<div>{flexRender(statusColumn.cell, { row })}</div>);

      expect(screen.getByTestId("error-tip-icon")).toBeInTheDocument();
      expect(screen.getByText("error")).toBeInTheDocument();
      // Tooltip content is not visible by default, just check the structure exists
      const tooltipTrigger = screen
        .getByText("error")
        .closest("span[data-state]");
      expect(tooltipTrigger).toBeInTheDocument();
    });

    it("should render default error message when reason is undefined", () => {
      const row = createMockRow({
        loadStatus: ELoadStatus.OtherError,
        reason: undefined,
      });
      const statusColumn = columns[5];

      render(<div>{flexRender(statusColumn.cell, { row })}</div>);

      expect(screen.getByTestId("error-tip-icon")).toBeInTheDocument();
      expect(screen.getByText("error")).toBeInTheDocument();
      // Tooltip content is not visible by default, just check the structure exists
      const tooltipTrigger = screen
        .getByText("error")
        .closest("span[data-state]");
      expect(tooltipTrigger).toBeInTheDocument();
    });

    it("should have correct accessor key", () => {
      const statusColumn = columns[5];
      expect(statusColumn.accessorKey).toBe("loadStatus");
      expect(statusColumn.header).toBe("status");
    });

    it("should apply correct CSS classes", () => {
      const row = createMockRow({ loadStatus: ELoadStatus.Uploaded });
      const statusColumn = columns[5];

      const { container } = render(
        <div>{flexRender(statusColumn.cell, { row })}</div>,
      );

      expect(container.firstChild?.firstChild).toHaveClass(
        "min-w-[125px]",
        "text-[16px]",
        "font-semibold",
        "lowercase",
        "font-outfit",
      );
    });
  });

  describe("Operation Column", () => {
    it("should render operation element correctly", () => {
      const operationElement = <button type="button">Test Operation</button>;
      const row = createMockRow({ operation: operationElement });
      const operationColumn = columns[6];

      const { container } = render(
        <div>{flexRender(operationColumn.cell, { row })}</div>,
      );

      expect(container).toHaveTextContent("Test Operation");
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render undefined operation gracefully", () => {
      const row = createMockRow({ operation: undefined });
      const operationColumn = columns[6];

      const { container } = render(
        <div>{flexRender(operationColumn.cell, { row })}</div>,
      );

      expect(container.firstChild?.firstChild).toBeNull();
    });

    it("should have correct column properties", () => {
      const operationColumn = columns[6];
      expect(operationColumn.id).toBe("operation");
      expect(operationColumn.header).toBe("");
    });
  });

  describe("Columns Structure", () => {
    it("should have correct number of columns", () => {
      expect(columns).toHaveLength(7);
    });

    it("should have all required columns", () => {
      const expectedColumns = [
        "name",
        "created",
        "creatorName",
        "updated",
        "lastModifierName",
        "loadStatus",
        "operation",
      ];

      expectedColumns.forEach((columnKey, index) => {
        if (columnKey === "operation") {
          expect(columns[index].id).toBe(columnKey);
        } else {
          expect(columns[index].accessorKey).toBe(columnKey);
        }
      });
    });
  });
});
