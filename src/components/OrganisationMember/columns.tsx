import type { IMemberItem } from "@/api/utils/organization";
import Copy from "@/components/Copy";
import type { ColumnDef } from "@tanstack/react-table";

export interface IMemberTable extends IMemberItem {
  operation?: JSX.Element;
  role?: JSX.Element;
}

export const columns: ColumnDef<IMemberTable>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="min-w-[125px] text-[15px] font-semibold pl-[15px]">
        {row.original.userName}
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
          description="email address copied"
          toCopy={row.original.email}
          className="text-[#606060] hover:text-white"
        />
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "organisation role",
    cell: ({ row }) => row.original.role,
  },

  {
    id: "operation",
    header: "",
    cell: ({ row }) => row.original.operation,
  },
];
