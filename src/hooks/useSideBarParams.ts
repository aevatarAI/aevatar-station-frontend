import { MENU_LIST, TAB_LIST } from "@/constants/sideBar";
import { useMemo } from "react";
import { useLocation, useParams } from "wouter";

export const useSideBarParams = () => {
  const [pathname] = useLocation();
  const params = useParams<{
    tab?: (typeof TAB_LIST)[number];
    menu?: (typeof MENU_LIST)[number];
  }>();
  const selectTab: (typeof TAB_LIST)[number] = useMemo(() => {
    const defaultTab = pathname.startsWith("/dashboard")
      ? "apikeys"
      : "general";

    if (TAB_LIST.includes(params?.tab ?? defaultTab))
      return params?.tab ?? defaultTab;
    return defaultTab;
  }, [params, pathname]);

  const selectMenu = useMemo(() => {
    if (MENU_LIST.includes(params?.menu ?? "profile"))
      return params?.menu ?? "profile";
    return "profile";
  }, [params]);

  return [selectMenu, selectTab] as const;
};
