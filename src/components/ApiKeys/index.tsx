import { columns, type IApiKeysList } from "@/components/ApiKeys/columns";
import CreateApiKeyDialog from "@/components/CreateApiKeyDialog";
import DataTable from "@/components/DataTable";
import { textGradient } from "@/constants/cls";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { sleep } from "@etransfer/utils";
import EditApiKeyDialog from "@/components/EditApiKeyDialog";
import DeleteDialog from "@/components/DeleteDialog";

export default function ApiKeys() {
  const [apiKeysList, setApiKeysList] = useState<IApiKeysList[]>([]);
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    setLoading(true);
    sleep(2000).then(() => {
      setApiKeysList([
        {
          id: "1",
          name: "name",
          apiKeys: "apiKeysapiKeysapiKeysapiKeysapiKeysapiKeys111111",
          createdTime:
            Date.now() - Math.floor(Math.random() * (24 * 60 * 60 * 1000)),
          createdBy: "createBycreateBy",
          isEdit: true,
          isRemove: true,
        },
        {
          id: "2",
          name: "text",
          apiKeys: "apiKeysapiKeysapiKeysapiKeysapiKeysapiKeys222222",
          createdTime:
            Date.now() - Math.floor(Math.random() * (24 * 60 * 60 * 1000)),
          createdBy:
            "createBycreateBycreateBycreateBycreateBycreateBycreateBycreateBycreateBycreateBycreateBycreateBy",
          isEdit: false,
          isRemove: true,
        },
        {
          id: "3",

          name: "text",
          apiKeys: "apiKeysapiKeysapiKeysapiKeysapiKeysapiKeys3433333",
          createdTime:
            Date.now() - Math.floor(Math.random() * (24 * 60 * 60 * 1000)),
          createdBy: "createBycreateBy",
          isEdit: true,
          isRemove: false,
        },
        {
          id: "4",

          name: "text",
          apiKeys: "apiKeysapiKeysapiKeysapiKeysapiKeysapiKeys444444",
          createdTime:
            Date.now() - Math.floor(Math.random() * (24 * 60 * 60 * 1000)),
          createdBy: "createBycreateBy",
          isEdit: false,
          isRemove: false,
        },
      ]);
      setLoading(false);
    });
  }, []);

  const onDeleteYes = useCallback(async () => {
    await sleep(1000);
  }, []);

  const tableData = useMemo(
    () =>
      apiKeysList.map((item) => ({
        ...item,
        operation: (
          <div className="flex items-center justify-between gap-[7px] pl-[20px]">
            {item.isEdit ? <EditApiKeyDialog /> : <span />}
            {item.isRemove ? (
              <DeleteDialog
                title="Are you sure you want to delete the API key?"
                onYes={onDeleteYes}
                description={
                  "*Once deleted, the existing API key will become invalid."
                }
              />
            ) : (
              <span />
            )}
          </div>
        ),
      })),
    [apiKeysList, onDeleteYes]
  );
  console.log(loading, "loading==");
  return (
    <div>
      <div className="flex justify-between items-center pb-[28px]">
        <div className={clsx(textGradient)}>api keys</div>
        <CreateApiKeyDialog />
      </div>
      <DataTable
        className={clsx(!loading && apiKeysList.length && "min-w-[600px]")}
        tableHeadClassName={"first:pl-[15px]"}
        columns={columns}
        loading={loading}
        data={tableData}
      />
    </div>
  );
}
