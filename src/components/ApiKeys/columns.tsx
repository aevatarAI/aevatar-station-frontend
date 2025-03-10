import Copy from "@/components/Copy";
import { shortenString } from "@/lib/text";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export interface IApiKeysList {
  id: string;
  name: string;
  apiKeys: string;
  createdTime: number | string;
  createdBy: string;
  isEdit?: boolean;
  isRemove?: boolean;
}

export interface IApiKeysListTable extends IApiKeysList {
  operation?: JSX.Element;
  apiKeysEle?: JSX.Element;
}

export const columns: ColumnDef<IApiKeysListTable>[] = [
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
    id: "apiKeys",
    header: "api keys",
    cell: ({ row }) => (
      <div className="flex items-center gap-[8px] font-source-code">
        <span>{shortenString(row.original.apiKeys)}</span>
        <Copy
          toCopy={row.original.apiKeys}
          className="text-[#606060] hover:text-white"
        />
      </div>
    ),
  },
  {
    accessorKey: "createdTime",
    header: "created",
    cell: ({ row }) => (
      <div className="pl-[19px] pr-[19px] w-[175px] font-source-code">
        {dayjs(row.original.createdTime).format("YYYY-MM-DD HH:mm")}
      </div>
    ),
  },
  {
    accessorKey: "createdBy",
    header: "created by",
    cell: ({ row }) => (
      <div className="text-[15px] font-semibold">{row.original.createdBy}</div>
    ),
  },
  {
    id: "operation",
    header: "",
    cell: ({ row }) => row.original.operation,
  },
];
