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

import SettingSidebar from "@/assets/setting-sidebar.svg?react";
import Workflow from "@/assets/workflow.svg?react";

import ProfileAndOrgDialog from "@/components/ProfileAndOrgDialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MENU_MAP_LIST } from "@/constants/sideBar";
import { useNavigate } from "@/hooks/navigate";
import { useSideBarParams } from "@/hooks/useSideBarParams";
import { ChevronRight } from "lucide-react";

// Organization Switcher Component
function OrganizationSwitcher() {
  const { open } = useSidebar();
  const [orgOpen, setOrgOpen] = useState<boolean>();
  const [currentOrganisationId, setCurrentOrganisationId] = useAtom(
    CURRENT_ORGANIZATION_ATOM,
  );
  const [organisationList] = useAtom(ORGANIZATIONS_LIST_ATOM);
  const currentOrganisation = useMemo(
    () =>
      organisationList?.find((item: any) => item.id === currentOrganisationId),
    [organisationList, currentOrganisationId],
  );

  if (!open) {
    return <OrgIcon />;
  }

  if (!currentOrganisation) {
    return (
      <div className="flex items-center gap-2">
        <OrgIcon />
        <div className="text-white font-outfit text-[14px] font-normal leading-[18px] lowercase">
          No Organisation
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2">
      <OrgIcon />
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
                  currentOrganisationId === item.id && itemSelectClassName,
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
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Workspace Navigation Component
function WorkspaceNavigation() {
  const [, selectTab] = useSideBarParams();
  const [activeSection, setActiveSection] = useState(
    MENU_MAP_LIST[selectTab as keyof typeof MENU_MAP_LIST]?.text ?? "workflows",
  );
  const navigate = useNavigate();
  const userPermissions = useOrgPermissions();
  const userProjectPermissions = useProjectPermissions();

  const dashboardMenuMap = useMemo(() => {
    const menuList = [];

    menuList.push({
      icon: <Workflow />,
      text: "Workflows",
      url: "/dashboard/workflows",
    });

    return menuList;
  }, []);

  const settingsMenuMap = useMemo(() => {
    const menuList = [];

    if (userProjectPermissions.projects)
      menuList.push({
        text: "Project",
        url: "/profile/projects/general",
      });

    if (userProjectPermissions.member || userProjectPermissions.memberManage)
      menuList.push({
        text: "Members",
        url: "/profile/projects/member",
      });

    if (
      userProjectPermissions.role ||
      userProjectPermissions.roleCreate ||
      userProjectPermissions.roleDelete ||
      userProjectPermissions.roleEdit
    )
      menuList.push({
        text: "Roles",
        url: "/profile/projects/role",
      });

    if (userPermissions.apiKeys || userProjectPermissions.apiKeys) {
      menuList.push({
        text: "API Keys",
        url: "/dashboard/apikeys",
      });
    }

    if (userProjectPermissions.plugins || userProjectPermissions.corsOrigins) {
      menuList.push({
        text: "CORS",
        url: "/dashboard/configuration",
      });
    }

    return menuList;
  }, [userPermissions, userProjectPermissions]);

  // Settings Navigation Component
  const SettingsNavigation = useMemo(
    () => (
      <SidebarGroupContent>
        <Collapsible
          key="settings"
          asChild
          defaultOpen={true}
          className="group/collapsible"
        >
          <SidebarMenu>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip="Settings">
                <SettingSidebar />
                <span>Settings</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {settingsMenuMap.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.text}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={activeSection === subItem.text}
                      onClick={() => {
                        setActiveSection(subItem.text as any);
                        navigate(subItem.url);
                      }}
                    >
                      <span>{subItem.text}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenu>
        </Collapsible>
      </SidebarGroupContent>
    ),
    [activeSection, navigate, settingsMenuMap],
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarGroupContent>
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
          {SettingsNavigation}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// Resources Navigation Component
function ResourcesNavigation() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Resources</SidebarGroupLabel>
      <SidebarGroupContent>
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function PageSideBarInner({ children }: PropsWithChildren) {
  return (
    <>
      <Sidebar collapsible="icon" variant="sidebar">
        <SidebarHeader>
          <OrganizationSwitcher />
        </SidebarHeader>
        <SidebarContent>
          <WorkspaceNavigation />
          {/* <SidebarSeparator /> */}
          <ResourcesNavigation />
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
        <ProfileAndOrgDialog />
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
