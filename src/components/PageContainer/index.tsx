"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import type { PropsWithChildren } from "react";

import StepSelect from "@/assets/chevrons-up-down.svg?react";
import OrgIcon from "@/assets/org-icon.svg?react";
import PageHeader from "@/components/PageContainer/PageHeader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { socialMediaList } from "@/constants/socialMedia";
import {
  CURRENT_ORGANIZATION_ATOM,
  ORGANIZATIONS_LIST_ATOM,
} from "@/state/atoms/organisation";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";

import {
  itemClassName,
  itemHoverClassName,
  itemSelectClassName,
} from "@/constants/cls";
import { useOrgPermissions } from "@/hooks/useOrgPermissions";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import clsx from "clsx";

import ApikeysIcon from "@/assets/api_keys.svg?react";
import Dll from "@/assets/dll_menu.svg?react";

import Workflow from "@/assets/workflow.svg?react";
import { useNavigate } from "@/hooks/navigate";
import { useSideBarParams } from "@/hooks/useSideBarParams";

export function PageSideBarInner({ children }: PropsWithChildren) {
  const [, selectTab] = useSideBarParams();
  const [activeSection, setActiveSection] = useState(selectTab ?? "workflows");
  const navigate = useNavigate();
  const [currentOrganisationId, setCurrentOrganisationId] = useAtom(
    CURRENT_ORGANIZATION_ATOM,
  );
  const [organisationList] = useAtom(ORGANIZATIONS_LIST_ATOM);
  const currentOrganisation = useMemo(
    () =>
      organisationList?.find((item: any) => item.id === currentOrganisationId),
    [organisationList, currentOrganisationId],
  );
  const { open } = useSidebar();
  const [orgOpen, setOrgOpen] = useState<boolean>();
  const userPermissions = useOrgPermissions();
  const userProjectPermissions = useProjectPermissions();

  const dashboardMenuMap = useMemo(() => {
    const menuList = [];
    if (userPermissions.apiKeys || userProjectPermissions.apiKeys) {
      menuList.push({
        icon: <ApikeysIcon />,
        text: "api keys",
        url: "/dashboard/apikeys",
      });
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

    menuList.push({
      icon: <Workflow />,
      text: "workflows",
      url: "/dashboard/workflows",
    });

    if (userProjectPermissions.plugins || userProjectPermissions.corsOrigins) {
      menuList.push({
        icon: <Dll />,
        text: "configuration",
        url: "/dashboard/configuration",
      });
    }

    return menuList;
  }, [userPermissions, userProjectPermissions]);

  return (
    <>
      <Sidebar collapsible="icon" variant="sidebar">
        <SidebarHeader>
          <div
            className={clsx(
              "flex items-center gap-2",
              !open && "p-0",
              open && "p-2",
            )}
          >
            <OrgIcon />

            {open &&
              (currentOrganisation ? (
                <Popover open={orgOpen} onOpenChange={setOrgOpen}>
                  <PopoverTrigger className="flex items-center gap-[8px] py-[4px] px-[6px] data-[state=open]:bg-black-light">
                    {currentOrganisation?.displayName ?? "--"}
                    <StepSelect className="text-[var(--line-color)]" />
                  </PopoverTrigger>
                  <PopoverContent className="lg:p-0 lg:pb-[17px] left-0 lg:-top-[10px] w-[259px]">
                    <div className="lg:p-[8px] max-h-[300px] scrollbar-hide overflow-auto">
                      {organisationList?.map((item: any) => (
                        <div
                          className={clsx(
                            itemClassName,
                            itemHoverClassName,
                            currentOrganisationId === item.id &&
                              itemSelectClassName,
                          )}
                          onClick={() => {
                            setCurrentOrganisationId(item.id);
                            setOrgOpen(false);
                          }}
                          key={item.id}
                        >
                          {item.displayName}
                        </div>
                      ))}
                    </div>

                    {/* <div className="flex justify-center lg:pt-[20px] lg:px-[12px] border-t border-black-light">
              <Button className="text-white w-full text-center font-outfit text-[13px] font-semibold py-[7px] leading-[14px] lowercase" onClick={() => {
                navigate("/profile/organisation/general")
                setOrgOpen(false)
              }}>
                <Add />
                create organisation
              </Button>
            </div> */}
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="text-white font-outfit text-[14px] font-normal leading-[18px] lowercase">
                  No Organisation
                </div>
              ))}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarMenu>
              {dashboardMenuMap.map((item) => (
                <SidebarMenuItem key={item.text}>
                  <SidebarMenuButton
                    tooltip={item.text}
                    isActive={activeSection === item.text}
                    onClick={() => {
                      setActiveSection(item.text as any);
                      navigate(item.url);
                    }}
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Resources</SidebarGroupLabel>
            <SidebarMenu>
              {socialMediaList.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => window.open(item.href, "_blank")}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />

        <SidebarRail />
      </Sidebar>
      <SidebarInset className="h-[100vh]">
        <div className="flex flex-col h-full">
          {/* Fixed header */}
          <div className="flex items-center gap-2 p-4 border-b border-[var(--border)] flex-shrink-0">
            <SidebarTrigger />
            <PageHeader />
          </div>
          {/* Scrollable content area */}
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </SidebarInset>
    </>
  );
}

export default function PageSideBar({ children }: PropsWithChildren) {
  return (
    <SidebarProvider defaultOpen={true}>
      <PageSideBarInner>{children}</PageSideBarInner>
    </SidebarProvider>
  );
}
