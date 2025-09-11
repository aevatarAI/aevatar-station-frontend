import { type IApiKeysList, columns } from "@/components/ApiKeys/columns";
import CreateApiKeyDialog from "@/components/CreateApiKeyDialog";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";
import EditApiKeyDialog from "@/components/EditApiKeyDialog";
import Loading from "@/components/Loading";
import {
  Tooltip,
  TooltipContent,
  TooltipContentCls,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { textGradient } from "@/constants/cls";
import { useDeleteAPIKey } from "@/hooks/useDeleteAPIKey";
import { useGetAPIKeys } from "@/hooks/useGetAPIKey";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import { useUpdateAPIKey } from "@/hooks/useUpdateAPIKey";
import { CURRENT_PROJECT_ATOM } from "@/state/atoms/organisation";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { Button } from "../ui/button";

export default function ApiKeys() {
  const [currentProjectId] = useAtom(CURRENT_PROJECT_ATOM);
  const { data, isLoading, isError } = useGetAPIKeys(currentProjectId || "");
  const permissions = useProjectPermissions();
  const { mutate: mutationUpdate } = useUpdateAPIKey();
  const { mutate } = useDeleteAPIKey();

  const tableData = useMemo(() => {
    return data?.data?.map((item: IApiKeysList) => ({
      ...item,
      operation: (
        <div key={item.id} className="flex justify-end gap-[7px] pr-[15px]">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <EditApiKeyDialog
                    name={item.appName}
                    disabled={!permissions.apiKeysEdit}
                    onYes={async (name: string) =>
                      mutationUpdate({
                        id: item.id,
                        name,
                        projectId: item.projectId,
                      })
                    }
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className={clsx(TooltipContentCls)}>
                edit
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <DeleteDialog
                    title="Are you sure you want to delete the API key?"
                    description="*Once deleted, the existing API key will become invalid."
                    disabled={!permissions.apiKeysDelete}
                    onYes={async () =>
                      mutate({ projectId: item.projectId, id: item.id })
                    }
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className={clsx(TooltipContentCls)}>
                delete
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    }));
  }, [data, permissions, mutate, mutationUpdate]);

  // if (isLoading) {
  //   return <Loading />;
  // }

  if (isError) {
    return <div>error...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center pb-[30px]">
        <div className={clsx(textGradient)}>API Keys</div>
        <CreateApiKeyDialog
          disabled={!permissions.apiKeysCreate || data?.data.length > 0}
        />
      </div>
      <DataTable
        className={clsx(!isLoading && data?.data?.length && "min-w-[600px]")}
        tableHeadClassName={"first:pl-[15px]"}
        columns={columns}
        loading={isLoading}
        emptyNode={
          <div data-testid="empty-dll-message">No API keys created yet</div>
        }
        data={tableData}
      />
    </div>
  );
}
