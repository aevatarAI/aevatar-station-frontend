import dayjs from "@/api/dayjs";
import type { IProjectItem } from "@/api/utils/organization";
import Copy from "@/components/Copy";
import type { ColumnDef } from "@tanstack/react-table";

export interface IProjectTable extends IProjectItem {
  operation?: JSX.Element;
}

export const columns: ColumnDef<IProjectTable>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="min-w-[125px] text-[14px] font-semibold pl-[15px] pr-[20px] md:pr-[30px]">
        {row.original.displayName}
      </div>
    ),
  },
  {
    id: "domainName",
    header: "domain name",
    cell: ({ row }) => (
      <div className="flex text-[var(--primary-foreground-text)] items-center gap-[8px] font-outfit pr-[20px] md:pr-[30px]">
        <span>{row.original.domainName}</span>
        <Copy
          description="domain name copied"
          toCopy={row.original.domainName}
          className="text-[var(--muted-foreground)] hover:text-[var(--color-foreground)]"
        />
      </div>
    ),
  },
  {
    accessorKey: "members",
    header: "members",
    cell: ({ row }) => (
      <div className="text-[var(--primary-foreground-text)] pr-[20px] md:pr-[30px] w-[175px] font-outfit">
        {row.original.memberCount}
      </div>
    ),
  },
  {
    accessorKey: "created",
    header: "created",
    cell: ({ row }) => (
      <div className="text-[var(--primary-foreground-text)] pr-[20px] md:pr-[30px] w-[175px] font-outfit">
        {dayjs
          .utc(row.original.creationTime)
          .local()
          .format("DD.MM.YYYY HH:mm")}
      </div>
    ),
  },
  {
    id: "operation",
    header: "",
    cell: ({ row }) => row.original.operation,
  },
];
