import { useOrgPermissions } from "@/hooks/useOrgPermissions";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import { useMemo } from "react";

export const usePermissionNavigate = () => {
  const { apiKeys: orgApiKeysPermission } = useOrgPermissions();
  const { apiKeys: projApiKeysPermission } = useProjectPermissions();

  const to = useMemo(() => {
    if (orgApiKeysPermission || projApiKeysPermission) {
      return "/dashboard/apikeys";
    }
    return "/dashboard/usage";
  }, [orgApiKeysPermission, projApiKeysPermission]);

  return { to };
};
