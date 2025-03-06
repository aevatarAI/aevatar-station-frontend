"use client";

import General from "@/assets/general.svg?react";
import Member from "@/assets/member.svg?react";
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

const menuItemClx =
  "relative flex text-[#606060] gap-[12px] items-center px-[18px] py-[5px] cursor-pointer";

const menuItemSelectedClx =
  "bg-white/40 text-white before:w-[8px] before:h-full before:absolute before:right-0 before:bg-white";

const menuItemTextClx =
  "font-syne text-[12px] font-semibold leading-normal lowercase";

const organisationList = [
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
  {
    icon: <Role />,
    text: "role",
    url: "/profile/organisation/role",
  },
];

const projectList = [
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
  {
    icon: <Role />,
    text: "role",
    url: "/profile/projects/role",
  },
];

export interface ISideBarProps {
  className?: string;
}

const tabList = ["apiKeys", "general", "notications", "member", "role"];

const menuList = ["profile", "organisation", "projects"];

export function SideBar({ className }: ISideBarProps) {
  const [pathname] = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [isNotification] = useAtom(notificationAtom);

  console.log(params, pathname, "params===");

  const profileList = useMemo(
    () => [
      {
        icon: <General />,
        text: "general",
        url: "/profile/profile/general",
      },
      {
        icon: isNotification ? <Notication /> : <NoticationEmpty />,
        text: "notications",
        url: "/profile/profile/notications",
      },
    ],
    [isNotification],
  );

  const profileMenuMap = useMemo(
    () => ({
      profile: profileList,
      organisation: organisationList,
      projects: projectList,
    }),
    [profileList],
  );

  const selectTab = useMemo(() => {
    const defaultTab = pathname.startsWith("/dashboard")
      ? "apikeys"
      : "general";
    if (tabList.includes(params?.tab ?? defaultTab)) return params?.tabs;
    return defaultTab;
  }, [params, pathname]);

  const selectMenu = useMemo(() => {
    if (menuList.includes(params?.menu ?? "profile")) return params?.menu;
    return "profile";
  }, [params]);

  const dashboardMenu = useMemo(() => {
    return (
      <div>
        <div
          onClick={() => navigate("/dashboard/apikeys")}
          className={clsx(
            menuItemClx,
            selectTab === "apikeys" && menuItemSelectedClx,
          )}
        >
          <General />
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
              item[0] === "profile" && "border-b border-[#606060] mb-[34px]",
            )}
          >
            <div
              className={clsx(
                "text-[#606060] font-source-code text-[11px] font-normal leading-normal lowercase mb-[16px]",
              )}
            >
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
    [profileMenuMap, selectTab, selectMenu, navigate],
  );

  return (
    <div
      className={clsx(
        "h-full flex flex-col  justify-between  pt-[35px] pr-[19px] pb-[36px] pl-[19px]",
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
