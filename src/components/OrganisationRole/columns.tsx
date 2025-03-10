import Copy from "@/components/Copy";
import type { ColumnDef } from "@tanstack/react-table";

export interface IRoleList {
  id: string;
  role: string;
  isRemove?: boolean;
}

export interface IRoleTable extends IRoleList {
  organisationRole?: JSX.Element;
  operation?: JSX.Element;
}

export const columns: ColumnDef<IRoleTable>[] = [
  {
    accessorKey: "role",
    header: "role",
    cell: ({ row }) => (
      <div className="min-w-[125px] text-[15px] font-semibold pl-[15px]">
        {row.original.role}
      </div>
    ),
  },

  {
    accessorKey: "organisationRole",
    header: "organisation role",
    cell: ({ row }) => row.original.organisationRole,
  },

  {
    id: "operation",
    header: "",
    cell: ({ row }) => row.original.operation,
  },
];
