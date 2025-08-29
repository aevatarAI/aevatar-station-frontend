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
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );

    const thead = screen.getByRole("rowgroup");
    expect(thead).toHaveClass("border-b", "border-solid");
  });

  it("should render table rows with borders", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const row = screen.getByRole("row");
    expect(row).toHaveClass("border-b", "border-solid");
  });

  it("should apply custom className", () => {
    const customClass = "custom-table-class";
    render(<Table className={customClass} />);

    const table = screen.getByRole("table");
    expect(table).toHaveClass(customClass);
  });
});
