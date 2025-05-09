import dayjs from "@/api/dayjs";
import { ELoadStatus, type IDllPlugin } from "@/api/utils/plugin";
import TipIcon from "@/assets/errorTip.svg?react";
import { TooltipContent } from "@/components/ui/tooltip";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
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
    accessorKey: "updated",
    header: "updated",
    cell: ({ row }) => (
      <div className="pr-[20px] md:pr-[30px] w-[175px] font-source-code">
        {row.original.lastModificationTime
          ? dayjs
              .utc(row.original.lastModificationTime)
              .local()
              .format("DD.MM.YYYY HH:mm")
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "lastModifierName",
    header: "updated by",
    cell: ({ row }) => {
      return (
        <div className="min-w-[125px] text-[15px] font-semibold">
          {row.original.lastModifierName || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "loadStatus",
    header: "status",
    cell: ({ row }) => {
      return (
        <div className="min-w-[125px] text-[14px] font-semibold lowercase font-syne">
          {row.original.loadStatus === ELoadStatus.Uploaded && "uploaded"}
          {row.original.loadStatus === ELoadStatus.Deployed && "deployed"}
          {row.original.loadStatus !== ELoadStatus.Uploaded &&
            row.original.loadStatus !== ELoadStatus.Deployed && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1">
                      <TipIcon />
                      <span className="text-[#FF2E2E]">error</span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{row.original.reason ?? "something went wrong"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
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
