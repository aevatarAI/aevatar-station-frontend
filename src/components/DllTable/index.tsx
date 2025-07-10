import { request } from "@/api";
import { getRestartStatus } from "@/api/utils/plugin";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";
import DllEditDialog from "@/components/DllEditDialog";
import { columns } from "@/components/DllTable/columns";
import {
  Tooltip,
  TooltipContent,
  TooltipContentCls,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { textGradient } from "@/constants/cls";
import type { TDllEditForm } from "@/constants/form/dll";
import { useToast } from "@/hooks/use-toast";
import { useCurrentProject } from "@/hooks/useCurrentProject";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import { useUpdateDllList } from "@/hooks/useUpdateDllList";
import { DLL_LIST_ATOM, RESTART_POD_SERVER_ATOM } from "@/state/atoms/dll";
import { CURRENT_PROJECT_ATOM } from "@/state/atoms/organisation";
import { delay } from "@/utils/common";
import { handleErrorMessage } from "@/utils/error";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";

export enum EDllEmptyMessage {
  NoDllsUploaded = "No DLLs uploaded yet",
  ServiceRestarting = "Service restarting...",
}

export default function DllTable() {
  const [loading, setLoading] = useState<boolean>();
  const { toast } = useToast();
  const [dllList] = useAtom(DLL_LIST_ATOM);
  const [projectId] = useAtom(CURRENT_PROJECT_ATOM);
  const [restartPodServer] = useAtom(RESTART_POD_SERVER_ATOM);
  const curProject = useCurrentProject();
  const updateDllHandler = useUpdateDllList();
  const projectPermissions = useProjectPermissions();

  const [dllEmptyMessage, setDllEmptyMessage] = useState<EDllEmptyMessage>(
    EDllEmptyMessage.NoDllsUploaded,
  );

  const getRestartStatusHandler = useCallback(async () => {
    const isServiceHealth = await getRestartStatus(
      `${curProject?.domainName}-client`,
    );
    if (isServiceHealth) setDllEmptyMessage(EDllEmptyMessage.NoDllsUploaded);
    else return setDllEmptyMessage(EDllEmptyMessage.ServiceRestarting);
  }, [curProject?.domainName]);

  const updateDllList = useCallback(async () => {
    if (!projectId) return;
    if (!curProject?.domainName) return;
    try {
      setLoading(true);

      try {
        await getRestartStatusHandler();
      } catch (error: any) {
        if (error?.message === "Network Error") {
          await delay(2000);
          await getRestartStatusHandler();
        }
      }

      await updateDllHandler(projectId);
      setLoading(false);
      window.scrollTo(0, 0);
    } catch (error) {
      console.log(error, "updateDllList===");
      setLoading(false);
    }
  }, [
    projectId,
    updateDllHandler,
    curProject?.domainName,
    getRestartStatusHandler,
  ]);

  useEffect(() => {
    updateDllList();
  }, [updateDllList]);

  const onEdit = useCallback(
    async ({ file }: TDllEditForm, id: string) => {
      const formData = new FormData();
      formData.append("code", file[0].content);
      await request.plugins.updatePlugins({
        query: `${curProject?.domainName}-client`,
        query1: id,
        data: { code: formData.get("code") },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      updateDllList();
    },
    [updateDllList, curProject?.domainName],
  );

  const onCreate = useCallback(
    async ({ file }: TDllEditForm) => {
      if (!projectId) return;

      const formData = new FormData();
      formData.append("code", file[0].content);
      formData.append("projectId", projectId);

      await request.plugins.addPlugins({
        query: `${curProject?.domainName}-client`,
        data: {
          projectId,
          code: formData.get("code"),
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      updateDllList();
    },
    [projectId, updateDllList, curProject?.domainName],
  );

  const onDeleteYes = useCallback(
    async (id: string) => {
      try {
        await request.plugins.deletePlugins({
          query: `${curProject?.domainName}-client`,
          query1: id,
        });
        toast({
          description: "successfully deleted",
        });
        updateDllList();
      } catch (error) {
        toast({
          description: handleErrorMessage(error),
        });
      }
    },
    [toast, updateDllList, curProject?.domainName],
  );
  console.log(restartPodServer, "restartPodServer==");
  const tableData = useMemo(
    () =>
      (dllList || []).map((item) => ({
        ...item,
        operation: (
          <div className="flex items-center gap-[7px] pl-[20px]">
            {projectPermissions?.pluginsEdit ? (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <DllEditDialog
                        type="edit"
                        onSubmit={(v) => onEdit(v, item.id)}
                        data-testid={`edit-dll-${item.id}`}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className={clsx(TooltipContentCls)}>
                    update
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <span />
            )}
            {projectPermissions?.pluginsDelete ? (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <DeleteDialog
                        onYes={() => onDeleteYes(item.id)}
                        title={"Are you sure you want to delete this dll?"}
                        data-testid={`delete-dll-${item.id}`}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className={clsx(TooltipContentCls)}>
                    delete
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <span />
            )}
          </div>
        ),
      })),
    [
      dllList,
      onEdit,
      onDeleteYes,
      projectPermissions?.pluginsEdit,
      projectPermissions?.pluginsDelete,
    ],
  );
  return (
    <div className="min-h-[394px]">
      <div className="flex justify-between items-center pb-[30px]">
        <div className={clsx(textGradient)}>dll</div>

        <DllEditDialog
          disabled={
            Boolean(restartPodServer?.projectId === projectId) &&
            !projectPermissions?.pluginsCreate
          }
          type="create"
          onSubmit={onCreate}
          data-testid="create-dll-button"
        />
      </div>
      <DataTable
        className={clsx(!loading && (dllList?.length || 0) && "min-w-[600px]")}
        tableHeadClassName={"first:pl-[15px]"}
        columns={columns}
        loading={loading}
        data={tableData}
        emptyNode={
          <div className="lowercase" data-testid="empty-dll-message">
            {dllEmptyMessage}
          </div>
        }
        data-testid="dll-table"
      />
    </div>
  );
}
