import type { ColumnDef } from "@tanstack/react-table";

export type Payment = {
  id: string;
  name: string;
  members: number;
  domainName: string;
  operation?: JSX.Element;
  created: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "domainName",
    header: "Domain Name",
  },
  {
    accessorKey: "members",
    header: "Members",
  },
  {
    accessorKey: "created",
    header: "Created",
  },
  {
    id: "operation",
    header: "",
    cell: ({ row }) => row.original.operation,
  },
];
