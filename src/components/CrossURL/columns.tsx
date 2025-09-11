import dayjs from "@/api/dayjs";
import type { ICrossURL } from "@/api/utils/plugin";
import type { ColumnDef } from "@tanstack/react-table";

export interface ICrossURLTable extends ICrossURL {
  operation?: JSX.Element;
}

export const columns: ColumnDef<ICrossURLTable>[] = [
  {
    accessorKey: "domain",
    header: "Domain",
    cell: ({ row }) => (
      <div className="min-w-[125px] text-[14px] font-semibold pl-[15px] pr-[20px] md:pr-[30px]">
        {row.original.domain}
      </div>
    ),
  },
  {
    accessorKey: "created",
    header: "Created",
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
    accessorKey: "creatorName",
    header: "Created By",
    cell: ({ row }) => {
      return (
        <div className="text-[var(--primary-foreground-text)] min-w-[125px] text-[14px] font-semibold">
          {row.original.creatorName || "Unknown"}
        </div>
      );
    },
  },

  {
    id: "operation",
    header: "",
    cell: ({ row }) => row.original.operation,
  },
];
