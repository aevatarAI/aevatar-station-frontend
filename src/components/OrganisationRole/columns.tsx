import type { IRoleItem } from "@/api/utils/organization";
import Copy from "@/components/Copy";
import type { ColumnDef } from "@tanstack/react-table";

export interface IRoleTable extends IRoleItem {
  organisationRole?: JSX.Element;
  operation?: JSX.Element;
}

export const columns: ColumnDef<IRoleTable>[] = [
  {
    accessorKey: "role",
    header: "role",
    cell: ({ row }) => (
      <div className="min-w-[125px] text-[14px] font-semibold pl-[15px] lowercase">
        {row.original.name?.split("_")?.[1] ?? "--"}
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
