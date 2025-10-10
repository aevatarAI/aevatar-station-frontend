import { useOrgPermissions } from "@/hooks/useOrgPermissions";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import { useMemo } from "react";

export const usePermissionNavigate = () => {
  const {
    apiKeys: _orgApiKeysPermission,
    dashboards: _orgDashboardsPermission,
  } = useOrgPermissions();
  const {
    apiKeys: _projApiKeysPermission,
    dashboards: _projDashboardsPermission,
  } = useProjectPermissions();

  const to = useMemo(() => {
    // if (orgApiKeysPermission || projApiKeysPermission) {
    //   return "/dashboard/apikeys";
    // }

    // if (orgDashboardsPermission || projDashboardsPermission) {
    //   return "/dashboard/usage";
    // }

    return "/dashboard/workflows";
  }, []);

  return { to };
};
