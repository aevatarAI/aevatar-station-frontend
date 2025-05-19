import { getCrossURLs } from "@/api/utils/plugin";
import CreateCrossURLDialog from "@/components/CreateCrossURLDialog";
import { type ICrossURLTable, columns } from "@/components/CrossURL/columns";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";
import { textGradient } from "@/constants/cls";
import { useToast } from "@/hooks/use-toast";
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
        description: handleErrorMessage(
          error,
          "Failed to update cross URL list",
        ),
      });
    }
  }, [projectId, toast]);

  useEffect(() => {
    updateCrossURLList();
  }, [updateCrossURLList]);

  const onCreate = useCallback(
    async ({ domain }: { domain: string }) => {
      if (!projectId) throw new Error("Project ID is required");

      updateCrossURLList();
    },
    [projectId, updateCrossURLList],
  );

  const onDeleteYes = useCallback(
    async (id: string) => {
      console.log("delete", id);
      try {
        toast({
          description: "cross-origin domain deleted",
        });
      } catch (error) {
        toast({
          description: handleErrorMessage(error, "Failed to delete cross-url"),
        });
      }
      updateCrossURLList();
    },
    [updateCrossURLList, toast],
  );

  const tableData = useMemo(
    () =>
      (crossURLs || []).map((item) => ({
        ...item,
        operation: (
          <div className="flex items-center gap-[7px] pl-[20px]">
            {/* ) : (
              <span />
            )} */}
            {/* {projectPermissions?.dllDelete ? ( */}
            <DeleteDialog
              onYes={() => onDeleteYes(item.id)}
              title={"Are you sure you want to delete this URL?"}
              data-testid={`delete-dll-${item.id}`}
            />
            {/* ) : (
              <span />
            )} */}
          </div>
        ),
      })),
    [crossURLs, onDeleteYes],
  );

  return (
    <div>
      <div className="flex justify-between items-center pb-[30px]">
        <div className={clsx(textGradient)}>cross-url</div>
        <CreateCrossURLDialog
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
          <div className="lowercase" data-testid="empty-dll-message">
            No Cross URL added yet
          </div>
        }
        data-testid="cross-url-table"
      />
    </div>
  );
}
