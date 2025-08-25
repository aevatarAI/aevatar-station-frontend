import type { IMemberItem } from "@/api/utils/project";
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
      <div className="min-w-[125px] text-[14px] font-semibold pl-[15px] pr-[15px] truncate max-w-full max-[640px]:max-w-[250px]">
        {row.original.userName}
      </div>
    ),
  },
  {
    id: "email",
    header: "email address",
    cell: ({ row }) => (
      <div className="flex items-center gap-[8px] font-outfit pr-[15px]  ">
        <span className="truncate max-w-full max-[640px]:max-w-[250px]">
          {row.original.email}
        </span>
        <Copy
          description="email address copied"
          toCopy={row.original.email}
          className="text-gray-deep hover:text-white"
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
