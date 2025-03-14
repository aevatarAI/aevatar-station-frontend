import CreateRoleDialog from "@/components/CreateRoleDialog";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";

import { columns, type IRoleList } from "./columns";
import PermissionManagerDialog from "@/components/PermissionManagerDialog";
import { textGradient } from "@/constants/cls";
import type { TCreateRoleForm } from "@/constants/form/createRole";
import { sleep } from "@etransfer/utils";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function ProjectRole() {
  const [roleList, setRoleList] = useState<IRoleList[]>([]);
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    setLoading(true);
    sleep(1000).then(() => {
      setRoleList([
        {
          id: "1",
          role: "name",
          isRemove: true,
        },
        {
          id: "2",
          role: "name22222222222",
          isRemove: false,
        },
        {
          id: "3",
          role: "name22223332222222",
          isRemove: true,
        },
        {
          id: "4",
          role: "name22223332222222",
          isRemove: false,
        },
      ]);
      setLoading(false);
    });
  }, []);

  const onDeleteYes = useCallback(async () => {
    await sleep(1000);
  }, []);

  const onPermissionSave = useCallback(async (id: string, value: any) => {
    console.log(id, value);
    await sleep(1000);
  }, []);

  const tableData = useMemo(
    () =>
      roleList.map((item) => ({
        ...item,
        projectRole: (
          <PermissionManagerDialog
            onSave={(v) => onPermissionSave(item.id, v)}
          />
        ),
        operation: (
          <div className="flex items-center justify-between gap-[7px] pl-[20px]">
            {item.isRemove ? (
              <DeleteDialog
                onYes={onDeleteYes}
                title={"Are you sure you want to delete the role?"}
                description={
                  "*Once deleted, the existing role will become invalid."
                }
              />
            ) : (
              <span />
            )}
          </div>
        ),
      })),
    [roleList, onDeleteYes, onPermissionSave]
  );

  const onCreate = useCallback(async (values: TCreateRoleForm) => {
    console.log(values, "values===");
    await sleep(1000);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center pb-[30px]">
        <div className={clsx(textGradient)}>project name roles</div>
        <CreateRoleDialog onCreate={onCreate} />
      </div>
      <DataTable
        className={clsx(!loading && roleList.length && "min-w-[600px]")}
        tableHeadClassName={"first:pl-[15px]"}
        columns={columns}
        loading={loading}
        data={tableData}
      />
    </div>
  );
}
