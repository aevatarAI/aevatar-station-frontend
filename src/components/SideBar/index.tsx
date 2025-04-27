"use client";

import ApikeysIcon from "@/assets/api_keys.svg?react";
import ChartIcon from "@/assets/chart.svg?react";
import Dll from "@/assets/dll_menu.svg?react";
import General from "@/assets/general.svg?react";
import Member from "@/assets/member.svg?react";
import Notication from "@/assets/notication.svg?react";
import NoticationEmpty from "@/assets/notification_empty.svg?react";
import Project from "@/assets/project.svg?react";
import Role from "@/assets/role.svg?react";
import {
  menuItemClx,
  menuItemSelectedClx,
  menuItemTextClx,
} from "@/constants/cls";
import { socialMediaList } from "@/constants/socialMedia";
import { useNavigate } from "@/hooks/navigate";
import { useGetUnreadNotifications } from "@/hooks/useGetUnreadNotifications";
import { useOrgPermissions } from "@/hooks/useOrgPermissions";
import { usePostReadNotifications } from "@/hooks/usePostReadNotifications";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import { useSideBarParams } from "@/hooks/useSideBarParams";
import { UNREAD_NOTIFICATION_ATOM } from "@/state/atoms/notification";
import {
  ORGANIZATIONS_LIST_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { useLocation, useParams } from "wouter";
export interface ISideBarProps {
  onClose?: () => void;
  className?: string;
}

export function SideBar({ className, onClose }: ISideBarProps) {
  useGetUnreadNotifications();
  const { mutate } = usePostReadNotifications();
  const navigate = useNavigate();
  const [pathname] = useLocation();
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  const params = useParams<{ tab?: string; menu?: string }>();
  const [unreadNotifications] = useAtom(UNREAD_NOTIFICATION_ATOM);
  const [projectList] = useAtom(PROJECT_LIST_ATOM);
  const [organisationList] = useAtom(ORGANIZATIONS_LIST_ATOM);
  const userPermissions = useOrgPermissions();
  const userProjectPermissions = useProjectPermissions();

  const organisationMenuList = useMemo(() => {
    if (organisationList?.length <= 0) return [];
    // if (!userPermissions.organizations) return [];
    const menuList = [];
    if (userPermissions.organizations)
      menuList.push({
        icon: <General />,
        text: "general",
        url: "/profile/organisation/general",
      });
    if (
      userPermissions.projects ||
      userPermissions.projectsCreate ||
      userPermissions.projectsDelete ||
      userPermissions.projectsEdit
    )
      menuList.push({
        icon: <Project />,
        text: "project",
        url: "/profile/organisation/project",
      });

    if (
      userPermissions.organizationMembers ||
      userPermissions.organizationMembersManage
    ) {
      menuList.push({
        icon: <Member />,
        text: "member",
        url: "/profile/organisation/member",
      });
    }
    if (
      userPermissions.role ||
      userPermissions.roleCreate ||
      userPermissions.roleDelete ||
      userPermissions.roleEdit
    )
      menuList.push({
        icon: <Role />,
        text: "role",
        url: "/profile/organisation/role",
      });

    return menuList;
  }, [organisationList, userPermissions]);

  const projectMenuList = useMemo(() => {
    if (projectList?.length <= 0) return [];
    if (!userProjectPermissions.projects) return [];
    const menuList = [];

    if (userProjectPermissions.projects)
      menuList.push({
        icon: <General />,
        text: "general",
        url: "/profile/projects/general",
      });

    if (userProjectPermissions.member || userProjectPermissions.memberManage)
      menuList.push({
        icon: <Member />,
        text: "member",
        url: "/profile/projects/member",
      });

    if (
      userProjectPermissions.role ||
      userProjectPermissions.roleCreate ||
      userProjectPermissions.roleDelete ||
      userProjectPermissions.roleEdit
    )
      menuList.push({
        icon: <Role />,
        text: "role",
        url: "/profile/projects/role",
      });
    return menuList;
  }, [projectList, userProjectPermissions]);

  const profileList = useMemo(() => {
    return [
      {
        icon: <General />,
        text: "general",
        url: "/profile/profile/general",
      },
      {
        icon: unreadNotifications ? <Notication /> : <NoticationEmpty />,
        text: "notifications",
        url: "/profile/profile/notifications",
      },
    ];
  }, [unreadNotifications]);

  const profileMenuMap = useMemo(() => {
    const menu: {
      profile: typeof profileList;
      organisation?: typeof organisationMenuList;
      projects?: typeof projectMenuList;
    } = { profile: profileList };
    if (organisationMenuList.length) menu.organisation = organisationMenuList;
    if (projectMenuList.length) menu.projects = projectMenuList;
    return menu;
  }, [profileList, projectMenuList, organisationMenuList]);

  const [selectMenu, selectTab] = useSideBarParams();

  const dashboardMenuMap = useMemo(() => {
    const menuList = [];
    if (userPermissions.apiKeys) {
      menuList.push({
        icon: <ApikeysIcon />,
        text: "api keys",
        url: "/dashboard/apikeys",
      });
    }
    menuList.push({
      icon: <ChartIcon />,
      text: "usage",
      url: "/dashboard/usage",
    });

    menuList.push({
      icon: <Dll />,
      text: "dll",
      url: "/dashboard/dll",
    });

    return menuList;
  }, [userPermissions]);

  const dashboardMenu = useMemo(() => {
    return (
      <div>
        <div className="flex flex-col gap-[10px]">
          {dashboardMenuMap.map((tab) => (
            <div
              key={tab.text}
              onClick={() => {
                navigate(tab.url);
                onClose?.();
              }}
              className={clsx(
                menuItemClx,
                selectTab === tab.text.replaceAll(" ", "") &&
                  menuItemSelectedClx,
              )}
            >
              {tab.icon}
              <span className={clsx(menuItemTextClx)}>{tab.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }, [selectTab, dashboardMenuMap, onClose, navigate]);

  const profileMenu = useMemo(
    () => (
      <div>
        {Object.entries(profileMenuMap).map((item) => (
          <div
            key={item[0]}
            className={clsx(
              "pb-[34px]",
              item[0] === "profile" && "border-b border-[#303030] mb-[34px]",
            )}
          >
            <div
              className={clsx(
                "text-[#B9B9B9] font-source-code text-[11px] font-normal leading-normal lowercase mb-[16px]",
              )}
            >
              {item[0]}
            </div>
            <div className="flex flex-col gap-[10px]">
              {item[1].map((tab) => (
                <div
                  key={tab.text}
                  onClick={() => {
                    if (tab.url.includes("notifications")) {
                      mutate();
                    }
                    navigate(tab.url);
                    onClose?.();
                  }}
                  className={clsx(
                    menuItemClx,
                    selectMenu === item[0] &&
                      selectTab === tab.text &&
                      menuItemSelectedClx,
                  )}
                >
                  {tab.icon}
                  <span className={clsx(menuItemTextClx)}>{tab.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
    [profileMenuMap, selectTab, selectMenu, mutate, onClose, navigate],
  );

  return (
    <div
      data-testid="sidebar-id"
      className={clsx(
        "h-full flex flex-col  justify-between  pt-[35px] pr-[19px] pb-[36px] pl-[19px] overflow-auto",
        className,
      )}
    >
      {pathname.startsWith("/dashboard") && dashboardMenu}
      {pathname.startsWith("/profile") && profileMenu}

      <div className={clsx("inline-flex pl-[22px] flex-col gap-[24px]")}>
        {socialMediaList.map((item) => (
          <a
            className="text-[#B9B9B9] font-syne text-[14px] font-semibold leading-normal lowercase"
            key={item.title}
            href={item.href}
            target="_blank"
            rel="noreferrer"
          >
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
}
