import { render, screen } from "@testing-library/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";

describe("Table Component", () => {
  it("should render table with borders", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>john@example.com</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    // Check if table container has border classes
    const tableContainer = table.parentElement;
    expect(tableContainer).toHaveClass("border", "border-solid", "rounded-lg");
  });

  it("should render table header with border", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );

    const thead = screen.getByRole("rowgroup");
    expect(thead).toHaveClass("border-b");
    // 检查是否包含 border-solid 类（可能在组合后的类名中）
    expect(thead.className).toMatch(/border-solid/);
  });

  it("should render table rows with borders", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const tbody = screen.getByRole("rowgroup");
    // TableBody itself doesn't have border-b, but TableRow does
    expect(tbody).toBeInTheDocument();

    const row = screen.getByRole("row");
    expect(row.className).toMatch(/border-b/);
  });

  it("should apply custom className", () => {
    const customClass = "custom-table-class";
    render(
      <Table className={customClass}>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const table = screen.getByRole("table");
    expect(table.className).toContain(customClass);
  });
});
