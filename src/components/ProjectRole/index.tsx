import CreateRoleDialog from "@/components/CreateRoleDialog";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";

import { getProjectRoles } from "@/api/utils/project";
import PermissionManagerDialog from "@/components/PermissionManagerDialog_backup";
import { textGradient } from "@/constants/cls";
import type { TCreateRoleForm } from "@/constants/form/createRole";
import { useToast } from "@/hooks/use-toast";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import {
  CURRENT_PROJECT_ATOM,
  CURRENT_PROJECT_ROLE_ATOM,
} from "@/state/atoms/organisation";
import { handleErrorMessage } from "@/utils/error";
import { sleep } from "@etransfer/utils";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { columns } from "./columns";

export default function ProjectRole() {
  const [roleList, setProjectRoles] = useAtom(CURRENT_PROJECT_ROLE_ATOM);
  const [loading, setLoading] = useState<boolean>();
  const [projectId] = useAtom(CURRENT_PROJECT_ATOM);
  const { toast } = useToast();
  const projectPermissions = useProjectPermissions();

  const getRoleList = useCallback(async () => {
    try {
      if (!projectId) return;
      setLoading(true);
      const result = await getProjectRoles(projectId);
      setProjectRoles(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      toast({
        description: handleErrorMessage(error, "get roles list"),
      });
    }
  }, [projectId, toast, setProjectRoles]);

  useEffect(() => {
    getRoleList();
  }, [getRoleList]);

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
            roleName={item.name}
            onSave={(v) => onPermissionSave(item.id, v)}
          />
        ),
        operation: (
          <div className="flex items-center justify-between gap-[7px] pl-[20px]">
            {projectPermissions.projectsEdit ? (
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
    [roleList, projectPermissions?.projectsEdit, onDeleteYes, onPermissionSave],
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
