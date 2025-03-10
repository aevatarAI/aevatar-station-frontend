import Copy from "@/components/Copy";
import type { ColumnDef } from "@tanstack/react-table";

export interface IMemberList {
  id: string;
  name: string;
  email: string;
  projectRole: string;
  isRemove?: boolean;
}

export interface IMemberTable extends IMemberList {
  operation?: JSX.Element;
  role?: JSX.Element;
}

export const columns: ColumnDef<IMemberTable>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="min-w-[125px] text-[15px] font-semibold pl-[15px]">
        {row.original.name}
      </div>
    ),
  },
  {
    id: "email",
    header: "email address",
    cell: ({ row }) => (
      <div className="flex items-center gap-[8px] font-source-code">
        <span>{row.original.email}</span>
        <Copy
          toCopy={row.original.email}
          className="text-[#606060] hover:text-white"
        />
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "project role",
    cell: ({ row }) => row.original.role,
  },

  {
    id: "operation",
    header: "",
    cell: ({ row }) => row.original.operation,
  },
];
