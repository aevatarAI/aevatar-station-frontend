import {
  addProjectCorsOrigin,
  deleteProjectCorsOrigin,
  getCrossURLs,
} from "@/api/utils/plugin";
import CreateCrossURLDialog from "@/components/CreateCrossURLDialog";
import { type ICrossURLTable, columns } from "@/components/CrossURL/columns";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipContentCls,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { textGradient } from "@/constants/cls";
import { useToast } from "@/hooks/use-toast";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import { CURRENT_PROJECT_ATOM } from "@/state/atoms/organisation";
import { handleErrorMessage } from "@/utils/error";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function CrossURL() {
  const [projectId] = useAtom(CURRENT_PROJECT_ATOM);
  const [crossURLs, setCrossURLs] = useState<ICrossURLTable[]>([]);
  const [loading, setLoading] = useState<boolean>();
  const { toast } = useToast();
  const projectPermissions = useProjectPermissions();

  const updateCrossURLList = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const crossURLs = await getCrossURLs(projectId);
      setCrossURLs(crossURLs);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        description: handleErrorMessage(error, "Failed to get Cross URL list"),
      });
    }
  }, [projectId, toast]);

  useEffect(() => {
    updateCrossURLList();
  }, [updateCrossURLList]);

  const onCreate = useCallback(
    async ({ domain }: { domain: string }) => {
      try {
        if (!projectId) throw new Error("Project ID is required");
        await addProjectCorsOrigin(projectId, domain);
        toast({
          description: "Cross-origin domain added",
        });
        updateCrossURLList();
      } catch (error) {
        toast({
          description: handleErrorMessage(error, "Failed to add Cross-URL"),
        });
      }
    },
    [projectId, updateCrossURLList, toast],
  );

  const onDeleteYes = useCallback(
    async (id: string) => {
      try {
        if (!projectId) throw new Error("Project ID is required");
        await deleteProjectCorsOrigin(projectId, id);
        toast({
          description: "Cross-origin domain deleted",
        });
      } catch (error) {
        toast({
          description: handleErrorMessage(error, "Failed to delete Cross-URL"),
        });
      }
      updateCrossURLList();
    },
    [projectId, updateCrossURLList, toast],
  );

  const tableData = useMemo(
    () =>
      (crossURLs || []).map((item) => ({
        ...item,
        operation: (
          <div className="flex items-center gap-[7px] pl-[20px]">
            {projectPermissions?.corsOriginsDelete ? (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <DeleteDialog
                        onYes={() => onDeleteYes(item.id)}
                        title={"Are you sure you want to delete this URL?"}
                        data-testid={"delete-cross-url-button"}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className={clsx(TooltipContentCls)}>
                    Delete
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <span />
            )}
          </div>
        ),
      })),
    [crossURLs, onDeleteYes, projectPermissions?.corsOriginsDelete],
  );

  return (
    <div>
      <div className="flex justify-between items-center pb-[30px]">
        <div className={clsx(textGradient)}>CORS</div>
        <CreateCrossURLDialog
          disabled={!projectPermissions?.corsOriginsCreate}
          type="create"
          data-testid="create-cross-url-button"
          onSubmit={onCreate}
        />
      </div>
      <DataTable
        className={clsx(
          !loading && (tableData?.length || 0) && "min-w-[600px]",
        )}
        tableHeadClassName={"first:pl-[15px]"}
        columns={columns}
        loading={loading}
        data={tableData}
        emptyNode={
          <div data-testid="empty-dll-message">No Cross URL added yet</div>
        }
        data-testid="cross-url-table"
      />
    </div>
  );
}
