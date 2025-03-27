import { type IApiKeysList, columns } from "@/components/ApiKeys/columns";
import CreateApiKeyDialog from "@/components/CreateApiKeyDialog";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";
import EditApiKeyDialog from "@/components/EditApiKeyDialog";
import { textGradient } from "@/constants/cls";
import { useDeleteAPIKey } from "@/hooks/useDeleteAPIKey";
import { useGetAPIKeys } from "@/hooks/useGetAPIKey";
import { useUpdateAPIKey } from "@/hooks/useUpdateAPIKey";
import clsx from "clsx";

export default function ApiKeys() {
  const { data, isLoading, isError } = useGetAPIKeys(
    "02d2d4de-dfca-dc54-3e79-3a18c8cb355c",
  );
  const { mutate: mutationUpdate } = useUpdateAPIKey();
  const { mutate } = useDeleteAPIKey();

  if (isLoading) {
    return <div>loading...</div>;
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
      <DataTable
        className={clsx(!isLoading && data.data.length && "min-w-[600px]")}
        tableHeadClassName={"first:pl-[15px]"}
        columns={columns}
        loading={isLoading}
        data={tableData()}
      />
    </div>
  );
}
