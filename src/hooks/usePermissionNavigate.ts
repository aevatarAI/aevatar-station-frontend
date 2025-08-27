import { useOrgPermissions } from "@/hooks/useOrgPermissions";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import { useMemo } from "react";

export const usePermissionNavigate = () => {
  const { apiKeys: orgApiKeysPermission, dashboards: orgDashboardsPermission } =
    useOrgPermissions();
  const {
    apiKeys: projApiKeysPermission,
    dashboards: projDashboardsPermission,
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
