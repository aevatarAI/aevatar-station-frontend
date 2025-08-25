import { useCallback, useEffect, useMemo, useState } from "react";

import {
  type IRolePermissionsItem,
  getOrganizationRolesPermission,
} from "@/api/utils/organization";

import PermissionManagerInnerDialog, {
  type TFlatPermission,
} from "@/components/PermissionManagerInnerDialog";
import { CURRENT_ORGANIZATION_ATOM } from "@/state/atoms/organisation";
import { useAtom } from "jotai";

export interface IPermissionManagerDialogProps {
  roleName: string;
  readonly?: boolean;
  onSave: (value: TFlatPermission[]) => Promise<void>;
}
export default function PermissionManagerDialog({
  roleName,
  readonly,
  onSave,
}: IPermissionManagerDialogProps) {
  const [curOrgId] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const [permissionOrigin, setPermissionOrigin] = useState<
    IRolePermissionsItem[]
  >([]);

  const getRolePermissions = useCallback(async () => {
    if (!curOrgId) return;
    const result = await getOrganizationRolesPermission(curOrgId, {
      providerName: "R",
      providerKey: roleName,
    });

    const list = result?.groups[0].permissions;
    setPermissionOrigin(list);
  }, [curOrgId, roleName]);

  useEffect(() => {
    getRolePermissions();
  }, [getRolePermissions]);

  const onSaveHandler = useCallback(
    async (value: TFlatPermission[]) => {
      await onSave(value);
      getRolePermissions();
    },
    [onSave, getRolePermissions],
  );

  return (
    <PermissionManagerInnerDialog
      permissionOrigin={permissionOrigin}
      readonly={readonly}
      onSave={onSaveHandler}
    />
  );
}
