import { type IApiKeysList, columns } from "@/components/ApiKeys/columns";
import CreateApiKeyDialog from "@/components/CreateApiKeyDialog";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";
import EditApiKeyDialog from "@/components/EditApiKeyDialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { textGradient } from "@/constants/cls";
import { useDeleteAPIKey } from "@/hooks/useDeleteAPIKey";
import { useGetAPIKeys } from "@/hooks/useGetAPIKey";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import { useUpdateAPIKey } from "@/hooks/useUpdateAPIKey";
import { CURRENT_PROJECT_ATOM } from "@/state/atoms/organisation";
import clsx from "clsx";
import { useAtom } from "jotai";
import { Ellipsis } from "lucide-react";
import { useMemo } from "react";

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
        <>
          {(permissions.apiKeysEdit || permissions?.apiKeysDelete) && (
            <Popover>
              <PopoverTrigger className="flex items-center gap-[8px] py-[4px] px-[6px]">
                <Ellipsis className="text-[var(--color-text-foreground)] w-[16px] h-[16px]" />
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="end"
                className="lg:p-0 left-0 lg:-top-[10px] w-[224px]"
              >
                <div className="lg:p-[8px] max-h-[300px] scrollbar-hide overflow-auto">
                  {permissions?.apiKeysEdit && (
                    <EditApiKeyDialog
                      name={item.appName}
                      disabled={!permissions?.apiKeysEdit}
                      onYes={async (name: string) =>
                        mutationUpdate({
                          id: item.id,
                          name,
                          projectId: item.projectId,
                        })
                      }
                    />
                  )}
                  {permissions?.apiKeysDelete && (
                    <DeleteDialog
                      title="Are you sure you want to delete the API key?"
                      description="*Once deleted, the existing API key will become invalid."
                      disabled={!permissions?.apiKeysDelete}
                      onYes={async () =>
                        mutate({ projectId: item.projectId, id: item.id })
                      }
                    />
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </>
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
          disabled={!permissions?.apiKeysCreate || data?.data.length > 0}
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
