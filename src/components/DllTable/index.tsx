import { request } from "@/api";
import CrossURL from "@/components/CrossURL";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";
import DllEditDialog from "@/components/DllEditDialog";
import { columns } from "@/components/DllTable/columns";
import { textGradient } from "@/constants/cls";
import type { TDllEditForm } from "@/constants/form/dll";
import { useToast } from "@/hooks/use-toast";
import { useUpdateDllList } from "@/hooks/useUpdateDllList";
import { DLL_LIST_ATOM, RESTART_POD_SERVER_ATOM } from "@/state/atoms/dll";
import { CURRENT_PROJECT_ATOM } from "@/state/atoms/organisation";
import { handleErrorMessage } from "@/utils/error";
import clsx from "clsx";
import { useAtom } from "jotai";
import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function DllTable() {
  const [loading, setLoading] = useState<boolean>();
  const { toast } = useToast();
  const [dllList] = useAtom(DLL_LIST_ATOM);
  const [projectId] = useAtom(CURRENT_PROJECT_ATOM);
  const [restartPodServer] = useAtom(RESTART_POD_SERVER_ATOM);

  const updateDllHandler = useUpdateDllList();

  const updateDllList = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    await updateDllHandler(projectId);
    setLoading(false);
    window.scrollTo(0, 0);
  }, [projectId, updateDllHandler]);

  useEffect(() => {
    updateDllList();
  }, [updateDllList]);

  const onEdit = useCallback(
    async ({ file }: TDllEditForm, id: string) => {
      const formData = new FormData();
      formData.append("code", file[0].content);
      await request.plugins.updatePlugins({
        query: id,
        data: { code: formData.get("code") },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      updateDllList();
    },
    [updateDllList],
  );

  const onCreate = useCallback(
    async ({ file }: TDllEditForm) => {
      if (!projectId) return;

      const formData = new FormData();
      formData.append("code", file[0].content);
      formData.append("projectId", projectId);

      await request.plugins.addPlugins({
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
    [projectId, updateDllList],
  );

  const onDeleteYes = useCallback(
    async (id: string) => {
      try {
        await request.plugins.deletePlugins({
          query: id,
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
    [toast, updateDllList],
  );

  const tableData = useMemo(
    () =>
      (dllList || []).map((item) => ({
        ...item,
        operation: (
          <div className="flex items-center gap-[7px] pl-[20px]">
            {/* {projectPermissions?.dllEdit ? ( */}
            <DllEditDialog
              type="edit"
              onSubmit={(v) => onEdit(v, item.id)}
              data-testid={`edit-dll-${item.id}`}
            />
            {/* ) : (
                <span />
              )} */}
            {/* {projectPermissions?.dllDelete ? ( */}
            <DeleteDialog
              onYes={() => onDeleteYes(item.id)}
              title={"Are you sure you want to delete this dll?"}
              data-testid={`delete-dll-${item.id}`}
            />
            {/* ) : (
                <span />
              )} */}
          </div>
        ),
      })),
    [dllList, onEdit, onDeleteYes],
  );
  return (
    <div className="min-h-[394px]">
      <div className="flex justify-between items-center pb-[30px]">
        <div className={clsx(textGradient)}>dll</div>

        <DllEditDialog
          disabled={
            Boolean(restartPodServer) // !projectPermissions?.dllCreate
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
            No DLLs uploaded yet
          </div>
        }
        data-testid="dll-table"
      />
    </div>
  );
}
