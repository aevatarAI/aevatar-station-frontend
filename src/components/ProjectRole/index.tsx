import CreateRoleDialog from "@/components/CreateRoleDialog";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";

import { request } from "@/api";
import type { IRoleItem } from "@/api/utils/organization";
import { getProjectRoles } from "@/api/utils/project";
import type { TFlatPermission } from "@/components/PermissionManagerInnerDialog";
import ProjectRoleManagerDialog from "@/components/ProjectRoleManagerDialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { textGradient } from "@/constants/cls";
import type { TCreateRoleForm } from "@/constants/form/createRole";
import { useToast } from "@/hooks/use-toast";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import {
  CURRENT_PROJECT_ATOM,
  CURRENT_PROJECT_ROLE_ATOM,
} from "@/state/atoms/organisation";
import { handleErrorMessage } from "@/utils/error";
import clsx from "clsx";
import { useAtom } from "jotai";
import { Ellipsis } from "lucide-react";
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

  const onDeleteYes = useCallback(
    async (id: string) => {
      try {
        if (!projectId) return;
        await request.projects.deleteProjectRoles({
          query: `${projectId}/roles/${id}`,
        });
        toast({
          description: "Successfully deleted",
        });
        getRoleList();
      } catch (error) {
        toast({
          description: handleErrorMessage(error, "get roles list"),
        });
      }
    },
    [projectId, toast, getRoleList],
  );

  const onPermissionSave = useCallback(
    async (item: IRoleItem, values: TFlatPermission[]) => {
      if (!projectId) return;
      await request.projects.setProjectRolePermissions({
        query: projectId,
        params: {
          providerName: "R",
          providerKey: item.name,
        },
        data: {
          permissions: values,
        },
      });
    },
    [projectId],
  );

  const tableData = useMemo(
    () =>
      roleList.map((item) => ({
        ...item,
        projectRole:
          item.name.split("_")[1].toLocaleLowerCase() !== "owner" ? (
            <ProjectRoleManagerDialog
              readonly={!projectPermissions?.roleEdit}
              roleName={item.name}
              onSave={(v) => onPermissionSave(item, v)}
            />
          ) : (
            <span />
          ),
        operation: (
          <div className="flex justify-end px-[20px]">
            {projectPermissions.projectsEdit &&
            item.name.split("_")[1].toLocaleLowerCase() !== "owner" ? (
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
                    <DeleteDialog
                      onYes={() => onDeleteYes(item.id)}
                      title={"Are you sure you want to delete the role?"}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <span />
            )}
          </div>
        ),
      })),
    [roleList, projectPermissions, onDeleteYes, onPermissionSave],
  );

  const onCreate = useCallback(
    async (values: TCreateRoleForm) => {
      try {
        if (!projectId) return;
        await request.projects.addProjectRoles({
          query: projectId,
          data: {
            name: values.roleName,
          },
        });
        getRoleList();
      } catch (error) {
        toast({
          description: handleErrorMessage(error, "create role error"),
        });
      }
    },
    [projectId, toast, getRoleList],
  );

  return (
    <div>
      <div className="flex justify-between items-center pb-[30px]">
        <div className={clsx(textGradient)}>Project Roles</div>
        {projectPermissions?.roleCreate ? (
          <CreateRoleDialog onCreate={onCreate} />
        ) : (
          <span />
        )}
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
