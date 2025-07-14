import { MENU_LIST, TAB_LIST } from "@/constants/sideBar";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import { useMemo } from "react";
import { useLocation, useParams } from "wouter";

export const useSideBarParams = () => {
  const [pathname] = useLocation();
  const params = useParams<{
    tab?: (typeof TAB_LIST)[number];
    menu?: (typeof MENU_LIST)[number];
  }>();

  const userProjectPermissions = useProjectPermissions();
  const permissionDefaultTab = useMemo(() => {
    if (userProjectPermissions.apiKeys) {
      return "apikeys";
    }

    // if (userPermissions.dashboards || userProjectPermissions.dashboards) {
    //   menuList.push({
    //     icon: <ChartIcon />,
    //     text: "usage",
    //     url: "/dashboard/usage",
    //   });
    // }

    // menuList.push({
    //   icon: <Agents />,
    //   text: "g-agents",
    //   url: "/dashboard/g-agents",
    // });

    if (userProjectPermissions.plugins || userProjectPermissions.corsOrigins) {
      return "configuration";
    }
    return "workflows";
  }, [userProjectPermissions]);

  const selectTab: (typeof TAB_LIST)[number] = useMemo(() => {
    const defaultTab = pathname.startsWith("/dashboard")
      ? permissionDefaultTab
      : "general";

    if (TAB_LIST.includes(params?.tab ?? defaultTab))
      return params?.tab ?? defaultTab;
    return defaultTab;
  }, [params, pathname, permissionDefaultTab]);

  const selectMenu = useMemo(() => {
    if (MENU_LIST.includes(params?.menu ?? "profile"))
      return params?.menu ?? "profile";
    return "profile";
  }, [params]);

  return [selectMenu, selectTab] as const;
};
