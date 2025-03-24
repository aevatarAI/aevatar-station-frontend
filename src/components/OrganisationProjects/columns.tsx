import type { IProjectItem } from "@/api/utils/organization";
import Copy from "@/components/Copy";
import { shortenString } from "@/utils/helpers";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export interface IProjectTable extends IProjectItem {
  operation?: JSX.Element;
}

export const columns: ColumnDef<IProjectTable>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="min-w-[125px] text-[15px] font-semibold pl-[15px] pr-[20px] md:pr-[30px]">
        {row.original.displayName}
      </div>
    ),
  },
  {
    id: "domainName",
    header: "domain name",
    cell: ({ row }) => (
      <div className="flex items-center gap-[8px] font-source-code pr-[20px] md:pr-[30px]">
        <span>{row.original.domainName}</span>
        <Copy
          toCopy={row.original.domainName}
          className="text-[#606060] hover:text-white"
        />
      </div>
    ),
  },
  {
    accessorKey: "members",
    header: "members",
    cell: ({ row }) => (
      <div className="pr-[20px] md:pr-[30px] w-[175px] font-source-code">
        {row.original.memberCount}
      </div>
    ),
  },
  {
    accessorKey: "created",
    header: "created",
    cell: ({ row }) => (
      <div className="pr-[20px] md:pr-[30px] w-[175px] font-source-code">
        {dayjs(row.original.creationTime).format("DD/MM/YYYY HH:mm")}
      </div>
    ),
  },
  {
    id: "operation",
    header: "",
    cell: ({ row }) => row.original.operation,
  },
];
