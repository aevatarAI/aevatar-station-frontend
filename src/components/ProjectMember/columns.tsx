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
    id: "emailAddress",
    header: "Email Address",
    cell: ({ row }) => (
      <div className="flex text-[var(--primary-foreground-text)] items-center gap-[8px] font-outfit pr-[15px]  ">
        <span className="truncate max-w-full max-[640px]:max-w-[250px]">
          {row.original.email}
        </span>
        <Copy
          description="Email address copied"
          toCopy={row.original.email}
          className="text-[var(--muted-foreground)] hover:text-[var(--color-foreground)]"
        />
      </div>
    ),
  },
  {
    accessorKey: "projectRole",
    header: "Project Role",
    cell: ({ row }) => (
      <div className="min-w-[125px] text-[14px] font-semibold pl-[15px] pr-[15px] truncate max-w-full max-[640px]:max-w-[250px]">
        {row.original.role}
      </div>
    ),
  },

  {
    id: "operation",
    header: "",
    cell: ({ row }) => row.original.operation,
  },
];
