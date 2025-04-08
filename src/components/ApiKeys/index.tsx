import { columns, type IApiKeysList } from "@/components/ApiKeys/columns";
import CreateApiKeyDialog from "@/components/CreateApiKeyDialog";
import DataTable from "@/components/DataTable";
import { textGradient } from "@/constants/cls";
import clsx from "clsx";
import EditApiKeyDialog from "@/components/EditApiKeyDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { useGetAPIKeys } from "@/hooks/useGetAPIKey";
import { useDeleteAPIKey } from "@/hooks/useDeleteAPIKey";
import { useUpdateAPIKey } from "@/hooks/useUpdateAPIKey";
import { useAtom } from "jotai";
import { CURRENT_PROJECT_ATOM } from "@/state/atoms/organisation";
import Loading from "@/components/Loading";

export default function ApiKeys() {
  const [currentProjectId] = useAtom(CURRENT_PROJECT_ATOM);
  const { data, isLoading, isError } = useGetAPIKeys(
    currentProjectId || ""
  );
  const { mutate: mutationUpdate } = useUpdateAPIKey();
  const { mutate } = useDeleteAPIKey();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>error...</div>;
  }

  const tableData = () => {
    return data.data.map((item: IApiKeysList) => ({
      ...item,
      operation: (
        <div key={item.id} className="flex justify-end gap-[7px] pr-[15px]">
          <EditApiKeyDialog
            name={item.appName}
            onYes={async (name: string) =>
              mutationUpdate({ id: item.id, name, projectId: item.projectId })
            }
          />
          <DeleteDialog
            title="Are you sure you want to delete the API key?"
            onYes={async () =>
              mutate({ projectId: item.projectId, id: item.id })
            }
            description={
              "*Once deleted, the existing API key will become invalid."
            }
          />
        </div>
      ),
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center pb-[30px]">
        <div className={clsx(textGradient)}>api keys</div>
        <CreateApiKeyDialog />
      </div>
      {data && (
        <DataTable
          className={clsx(!isLoading && data.data.length && "min-w-[600px]")}
          tableHeadClassName={"first:pl-[15px]"}
          columns={columns}
          loading={isLoading}
          data={tableData()}
        />
      )}
    </div>
  );
}
