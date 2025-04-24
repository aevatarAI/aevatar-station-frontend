import dayjs from "@/api/dayjs";
import type { IProjectItem } from "@/api/utils/organization";
import type { IDllPlugin } from "@/api/utils/plugin";
import Copy from "@/components/Copy";
import type { ColumnDef } from "@tanstack/react-table";

export interface IProjectTable extends IDllPlugin {
  operation?: JSX.Element;
}

export const columns: ColumnDef<IProjectTable>[] = [
  {
    accessorKey: "name",
    header: "dll file",
    cell: ({ row }) => (
      <div className="min-w-[125px] text-[15px] font-semibold pl-[15px] pr-[20px] md:pr-[30px]">
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: "created",
    header: "created",
    cell: ({ row }) => (
      <div className="pr-[20px] md:pr-[30px] w-[175px] font-source-code">
        {dayjs
          .utc(row.original.creationTime)
          .local()
          .format("DD.MM.YYYY HH:mm")}
      </div>
    ),
  },
  {
    accessorKey: "creatorName",
    header: "created by",
    cell: ({ row }) => {
      return (
        <div className="min-w-[125px] text-[15px] font-semibold">
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
