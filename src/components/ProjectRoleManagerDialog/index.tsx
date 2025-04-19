import { useCallback, useEffect, useMemo, useState } from "react";

import type { IRolePermissionsItem } from "@/api/utils/organization";

import { getProjectRolesPermission } from "@/api/utils/project";
import PermissionManagerInnerDialog, {
  type TFlatPermission,
} from "@/components/PermissionManagerInnerDialog";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_PROJECT_ATOM,
} from "@/state/atoms/organisation";
import { useAtom } from "jotai";

export interface IProjectRoleManagerDialogProps {
  roleName: string;
  readonly?: boolean;
  onSave: (value: TFlatPermission[]) => Promise<void>;
}
export default function ProjectRoleManagerDialog({
  roleName,
  readonly,
  onSave,
}: IProjectRoleManagerDialogProps) {
  const [projectId] = useAtom(CURRENT_PROJECT_ATOM);

  const [permissionOrigin, setPermissionOrigin] = useState<
    IRolePermissionsItem[]
  >([]);

  const getRolePermissions = useCallback(async () => {
    if (!projectId) return;
    const result = await getProjectRolesPermission(projectId, {
      providerName: "R",
      providerKey: roleName,
    });
    if (!result) return;
    const list = result?.groups[0].permissions;
    setPermissionOrigin(list);
  }, [projectId, roleName]);

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
