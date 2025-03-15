"use client";

import General from "@/assets/general.svg?react";
import Member from "@/assets/member.svg?react";
import ApikeysIcon from "@/assets/api_keys.svg?react";
import Notication from "@/assets/notication.svg?react";
import NoticationEmpty from "@/assets/notification_empty.svg?react";
import Project from "@/assets/project.svg?react";
import Role from "@/assets/role.svg?react";
import { socialMediaList } from "@/constants/socialMedia";
import clsx from "clsx";
import { useMemo } from "react";
import { useLocation, useParams } from "wouter";

import { useNavigate } from "@/hooks/navigate";
import { notificationAtom } from "@/state/atoms/notification";
import { useAtom } from "jotai";
import { useSideBarParams } from "@/hooks/useSideBarParams";
import {
  menuItemClx,
  menuItemSelectedClx,
  menuItemTextClx,
} from "@/constants/cls";
import {
  CURRENT_PROJECT_ATOM,
  ORGANIZATIONS_LIST_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";

export interface ISideBarProps {
  className?: string;
}

export function SideBar({ className }: ISideBarProps) {
  const [pathname] = useLocation();
  const params = useParams<{ tab?: string; menu?: string }>();
  const navigate = useNavigate();
  const [isNotification] = useAtom(notificationAtom);

  const [projectList] = useAtom(PROJECT_LIST_ATOM);
  const [organisationList] = useAtom(ORGANIZATIONS_LIST_ATOM);
  const userPermissions = useUserPermissions();
  const userProjectPermissions = useProjectPermissions();

  console.log(params, pathname, "params===");

  const organisationMenuList = useMemo(() => {
    if (organisationList.length <= 0) return [];
    if (!userPermissions.organizations) return [];
    return [
      {
        icon: <General />,
        text: "general",
        url: "/profile/organisation/general",
      },
      {
        icon: <Project />,
        text: "project",
        url: "/profile/organisation/project",
      },
      {
        icon: <Member />,
        text: "member",
        url: "/profile/organisation/member",
      },
      // {
      //   icon: <Role />,
      //   text: "role",
      //   url: "/profile/organisation/role",
      // },
    ];
  }, [organisationList, userPermissions]);

  const projectMenuList = useMemo(() => {
    if (projectList.length <= 0) return [];
    if (!userProjectPermissions.projects) return [];
    return [
      {
        icon: <General />,
        text: "general",
        url: "/profile/projects/general",
      },

      {
        icon: <Member />,
        text: "member",
        url: "/profile/projects/member",
      },
      // {
      //   icon: <Role />,
      //   text: "role",
      //   url: "/profile/projects/role",
      // },
    ];
  }, [projectList, userProjectPermissions.projects]);

  const profileList = useMemo(
    () => [
      {
        icon: <General />,
        text: "general",
        url: "/profile/profile/general",
      },
      {
        icon: isNotification ? <Notication /> : <NoticationEmpty />,
        text: "notifications",
        url: "/profile/profile/notifications",
      },
    ],
    [isNotification]
  );

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

  const dashboardMenu = useMemo(() => {
    return (
      <div>
        <div
          onClick={() => navigate("/dashboard/apikeys")}
          className={clsx(
            menuItemClx,
            selectTab === "apikeys" && menuItemSelectedClx
          )}>
          <ApikeysIcon />
          <span className={clsx(menuItemTextClx)}>api keys</span>
        </div>
      </div>
    );
  }, [selectTab, navigate]);

  const profileMenu = useMemo(
    () => (
      <div>
        {Object.entries(profileMenuMap).map((item) => (
          <div
            key={item[0]}
            className={clsx(
              "pb-[34px]",
              item[0] === "profile" && "border-b border-[#303030] mb-[34px]"
            )}>
            <div
              className={clsx(
                "text-[#B9B9B9] font-source-code text-[11px] font-normal leading-normal lowercase mb-[16px]"
              )}>
              {item[0]}
            </div>
            <div className="flex flex-col gap-[10px]">
              {item[1].map((tab) => (
                <div
                  key={tab.text}
                  onClick={() => navigate(tab.url)}
                  className={clsx(
                    menuItemClx,
                    selectMenu === item[0] &&
                      selectTab === tab.text &&
                      menuItemSelectedClx
                  )}>
                  {tab.icon}
                  <span className={clsx(menuItemTextClx)}>{tab.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
    [profileMenuMap, selectTab, selectMenu, navigate]
  );

  return (
    <div
      className={clsx(
        "h-full flex flex-col  justify-between  pt-[35px] pr-[19px] pb-[36px] pl-[19px] overflow-auto",
        className
      )}>
      {pathname.startsWith("/dashboard") && dashboardMenu}
      {pathname.startsWith("/profile") && profileMenu}

      <div className={clsx("inline-flex pl-[22px] flex-col gap-[24px]")}>
        {socialMediaList.map((item) => (
          <a
            className="text-[#B9B9B9] font-syne text-[14px] font-semibold leading-normal lowercase"
            key={item.title}
            href={item.href}
            target="_blank"
            rel="noreferrer">
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
}
