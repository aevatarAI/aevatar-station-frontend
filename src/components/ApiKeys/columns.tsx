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
      <div className="min-w-[125px] text-[14px] font-semibold pl-[15px]">
        {row.original.appName}
      </div>
    ),
  },
  {
    accessorKey: "clientId",
    header: "Client ID",
    cell: ({ row }) => (
      <div className="flex text-[var(--primary-foreground-text)] items-center gap-[8px] font-geist pr-[20px] md:pr-[30px]">
        <span>{row.original.appId}</span>
        <Copy
          description="Client ID copied"
          toCopy={row.original.appId}
          className="text-[var(--muted-foreground)] hover:text-[var(--color-foreground)]"
        />
      </div>
    ),
  },
  {
    accessorKey: "apiKey",
    header: "API Key",
    cell: ({ row }) => (
      <div className="flex text-[var(--primary-foreground-text)] items-center gap-[8px] font-geist pr-[20px] md:pr-[30px]">
        <span>{shortenString(row.original.appSecret)}</span>
        <Copy
          description="API key copied"
          toCopy={row.original.appSecret}
          className="text-[var(--muted-foreground)] hover:text-[var(--color-foreground)]"
        />
      </div>
    ),
  },
  {
    accessorKey: "created",
    header: "Created",
    cell: ({ row }) => (
      <div className="text-[var(--primary-foreground-text)] pr-[20px] md:pr-[30px] w-[175px] font-geist">
        {dayjs.utc(row.original.createTime).local().format("DD.MM.YYYY HH:mm")}
      </div>
    ),
  },
  {
    accessorKey: "createdBy",
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
