import { request } from "@/api";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";
import DllEditDialog from "@/components/DllEditDialog";
import { columns } from "@/components/DllPage/columns";
import { textGradient } from "@/constants/cls";
import type { TDllEditForm } from "@/constants/form/dll";
import type { TProjectEditForm } from "@/constants/form/project";
import { useToast } from "@/hooks/use-toast";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import { useUpdateDllList } from "@/hooks/useUpdateDllList";
import { DLL_LIST_ATOM } from "@/state/atoms/dll";
import { CURRENT_PROJECT_ATOM } from "@/state/atoms/organisation";
import { handleErrorMessage } from "@/utils/error";
import { sleep } from "@etransfer/utils";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function DllPage() {
  const [loading, setLoading] = useState<boolean>();
  const { toast } = useToast();
  const [dllList] = useAtom(DLL_LIST_ATOM);
  const [projectId] = useAtom(CURRENT_PROJECT_ATOM);

  const projectPermissions = useProjectPermissions();
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
      await request.plugins.updatePlugins({
        query: id,
        data: {
          code: file,
        },
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
      console.log(file, "file==onCreate");
      if (!projectId) return;
      await sleep(100000);
      await request.plugins.addPlugins({
        data: {
          projectId,
          code: file,
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
      dllList.map((item) => ({
        ...item,
        operation: (
          <div className="flex items-center gap-[7px] pl-[20px]">
            {projectPermissions?.dllEdit ? (
              <DllEditDialog type="edit" onSubmit={(v) => onEdit(v, item.id)} />
            ) : (
              <span />
            )}
            {projectPermissions?.dllDelete ? (
              <DeleteDialog
                onYes={() => onDeleteYes(item.id)}
                title={"Are you sure you want to delete this dll?"}
              />
            ) : (
              <span />
            )}
          </div>
        ),
      })),
    [dllList, projectPermissions, onEdit, onDeleteYes],
  );
  return (
    <div>
      <div className="flex justify-between items-center pb-[30px]">
        <div className={clsx(textGradient)}>dll</div>

        <DllEditDialog
          // disabled={!projectPermissions?.dllCreate}
          type="create"
          onSubmit={onCreate}
        />
      </div>
      <DataTable
        className={clsx(!loading && dllList.length && "min-w-[600px]")}
        tableHeadClassName={"first:pl-[15px]"}
        columns={columns}
        loading={loading}
        data={tableData}
        emptyNode={<div className="lowercase">No DLLs uploaded yet</div>}
      />
    </div>
  );
}
