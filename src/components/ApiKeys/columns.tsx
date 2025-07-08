import dayjs from "@/api/dayjs";
import Copy from "@/components/Copy";
import { shortenString } from "@/utils/helpers";
import type { ColumnDef } from "@tanstack/react-table";

export interface IApiKeysList {
  id: string;
  projectId: string;
  appName: string;
  appId: string;
  appSecret: string;
  createTime: number | string;
  creatorName: string;
  isEdit?: boolean;
  isRemove?: boolean;
}

export interface IApiKeysListTable extends IApiKeysList {
  operation?: JSX.Element;
  apiKeysEle?: JSX.Element;
}

export const columns: ColumnDef<IApiKeysListTable>[] = [
  {
    accessorKey: "appName",
    header: "Name",
    cell: ({ row }) => (
      <div className="min-w-[125px] text-[15px] font-semibold pl-[15px]">
        {row.original.appName}
      </div>
    ),
  },
  {
    accessorKey: "appId",
    header: "client id",
    cell: ({ row }) => (
      <div className="flex items-center gap-[8px] font-outfit pr-[20px] md:pr-[30px]">
        <span>{row.original.appId}</span>
        <Copy
          description="client id copied"
          toCopy={row.original.appId}
          className="text-gray-deep hover:text-white"
        />
      </div>
    ),
  },
  {
    id: "appSecret",
    header: "api key",
    cell: ({ row }) => (
      <div className="flex items-center gap-[8px] font-outfit pr-[20px] md:pr-[30px]">
        <span>{shortenString(row.original.appSecret)}</span>
        <Copy
          description="api key copied"
          toCopy={row.original.appSecret}
          className="text-gray-deep hover:text-white"
        />
      </div>
    ),
  },
  {
    accessorKey: "createTime",
    header: "created",
    cell: ({ row }) => (
      <div className="pr-[20px] md:pr-[30px] w-[175px] font-outfit">
        {dayjs.utc(row.original.createTime).local().format("DD.MM.YYYY HH:mm")}
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
