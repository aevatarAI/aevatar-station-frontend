import CreateRoleDialog from "@/components/CreateRoleDialog";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";

import { type IRoleList, columns } from "@/components/OrganisationRole/columns";
import PermissionManagerDialog from "@/components/PermissionManagerDialog";
import { textGradient } from "@/constants/cls";
import type { TCreateRoleForm } from "@/constants/form/createRole";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function OrganisationRole() {
  const [roleList, setRoleList] = useState<IRoleList[]>([]);
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    setLoading(true);
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
  }, []);

  const onDeleteYes = useCallback(async () => {}, []);

  const onPermissionSave = useCallback(async (id: string, value: any) => {
<<<<<<< Updated upstream
    console.log(id, value);
=======
    await sleep(1000);
>>>>>>> Stashed changes
  }, []);

  const tableData = useMemo(
    () =>
      roleList.map((item) => ({
        ...item,
        organisationRole: (
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
    [roleList, onDeleteYes, onPermissionSave],
  );

  const onCreate = useCallback(async (values: TCreateRoleForm) => {
<<<<<<< Updated upstream
    console.log(values, "values===");
=======
    await sleep(1000);
>>>>>>> Stashed changes
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center pb-[30px]">
        <div className={clsx(textGradient)}>Organisation name roles</div>
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
