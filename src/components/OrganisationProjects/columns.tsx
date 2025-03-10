import Copy from "@/components/Copy";
import { shortenString } from "@/lib/text";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export interface IProjectList {
  id: string;
  name: string;
  domainName: string;
  members: number;
  created: string | number;
  isEdit?: boolean;
  isRemove?: boolean;
}

export interface IProjectTable extends IProjectList {
  operation?: JSX.Element;
}

export const columns: ColumnDef<IProjectTable>[] = [
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
    id: "domainName",
    header: "domain name",
    cell: ({ row }) => (
      <div className="flex items-center gap-[8px] font-source-code">
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
      <div className="pl-[19px] pr-[19px] w-[175px] font-source-code">
        {row.original.members}
      </div>
    ),
  },
  {
    accessorKey: "created",
    header: "created",
    cell: ({ row }) => (
      <div className="pl-[19px] pr-[19px] w-[175px] font-source-code">
        {dayjs(row.original.created).format("YYYY-MM-DD HH:mm")}
      </div>
    ),
  },
  {
    id: "operation",
    header: "",
    cell: ({ row }) => row.original.operation,
  },
];
