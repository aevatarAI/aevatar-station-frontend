import { request } from "@/api";
import { type IRoleItem, getOrganizationRoles } from "@/api/utils/organization";
import CreateRoleDialog from "@/components/CreateRoleDialog";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";

import { columns } from "@/components/OrganisationRole/columns";
import PermissionManagerDialog from "@/components/PermissionManagerDialog";
import type { TFlatPermission } from "@/components/PermissionManagerInnerDialog";
import { textGradient } from "@/constants/cls";
import type { TCreateRoleForm } from "@/constants/form/createRole";
import { useToast } from "@/hooks/use-toast";
import { useOrgPermissions } from "@/hooks/useOrgPermissions";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_ORGANIZATION_ROLE_ATOM,
} from "@/state/atoms/organisation";
import { handleErrorMessage } from "@/utils/error";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function OrganisationRole() {
  const [roleList, setOrganisationRoles] = useAtom(
    CURRENT_ORGANIZATION_ROLE_ATOM,
  );
  const [loading, setLoading] = useState<boolean>();
  const [currentOrganisationId] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const userPermissions = useOrgPermissions();
  const { toast } = useToast();
  const getRoleList = useCallback(async () => {
    try {
      if (!currentOrganisationId) return;
      setLoading(true);
      const result = await getOrganizationRoles(currentOrganisationId);
      setOrganisationRoles(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      toast({
        description: handleErrorMessage(error, "get roles list"),
      });
    }
  }, [currentOrganisationId, toast, setOrganisationRoles]);

  useEffect(() => {
    getRoleList();
  }, [getRoleList]);

  const onDeleteYes = useCallback(
    async (id: string) => {
      try {
        if (!currentOrganisationId) return;

        await request.organizations.deleteOrganizationRoles({
          query: `${currentOrganisationId}/roles/${id}`,
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
    [currentOrganisationId, toast, getRoleList],
  );
  const onPermissionSave = useCallback(
    async (item: IRoleItem, values: TFlatPermission[]) => {
      if (!currentOrganisationId) return;
      await request.organizations.setOrganizationRolePermissions({
        query: currentOrganisationId,
        params: {
          providerName: "R",
          providerKey: item.name,
        },
        data: {
          permissions: values,
        },
      });
    },
    [currentOrganisationId],
  );

  const tableData = useMemo(
    () =>
      roleList.map((item) => ({
        ...item,
        organisationRole:
          item.name.split("_")[1].toLocaleLowerCase() !== "owner" ? (
            <PermissionManagerDialog
              isOwner={item.name.split("_")[1].toLocaleLowerCase() === "owner"}
              roleName={item.name}
              onSave={(v) => onPermissionSave(item, v)}
            />
          ) : (
            <span />
          ),
        operation: (
          <div className="flex items-center justify-between gap-[7px] pl-[20px]">
            {userPermissions.roleDelete &&
            item.name.split("_")[1].toLocaleLowerCase() !== "owner" ? (
              <DeleteDialog
                onYes={() => onDeleteYes(item.id)}
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
    [roleList, userPermissions, onDeleteYes, onPermissionSave],
  );

  const onCreate = useCallback(
    async (values: TCreateRoleForm) => {
      try {
        if (!currentOrganisationId) return;
        await request.organizations.addOrganizationRoles({
          query: currentOrganisationId,
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
    [currentOrganisationId, toast, getRoleList],
  );

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
