import OrgGeneral from "@/assets/org-general.svg?react";
import OrgMembers from "@/assets/org-members.svg?react";
import OrgProjects from "@/assets/org-projects.svg?react";
import OrgRoles from "@/assets/org-roles.svg?react";
import User from "@/assets/profile-general.svg?react";
import DialogInner from "@/components/ProfileAndOrgDialog/Dialog.inner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { PROFILE_DIALOG_MENU, PROFILE_DIALOG_TABS } from "@/constants/sideBar";
import { PROFILE_DIALOG_ATOM } from "@/state/atoms/profile.dialog";
import { useAtom } from "jotai";
import {
  Bell,
  Building2,
  ChevronRight,
  FolderOpen,
  Shield,
  Users,
} from "lucide-react";

// Sidebar navigation configuration
const sidebarConfig = {
  profile: {
    label: "Profile",
    items: [
      { id: "general", label: "General", icon: User },
      { id: "notifications", label: "Notifications", icon: Bell },
    ],
  },
  organisation: {
    label: "Organisation",
    items: [
      { id: "general", label: "General", icon: OrgGeneral },
      { id: "project", label: "Projects", icon: OrgProjects },
      { id: "member", label: "Members", icon: OrgMembers },
      { id: "role", label: "Roles", icon: OrgRoles },
    ],
  },
};

export default function ProfileAndOrgDialog() {
  const [{ open, menu = "profile", tab = "general" }, setProfileDialog] =
    useAtom(PROFILE_DIALOG_ATOM);

  const handleMenuChange = (newMenu: "profile" | "organisation") => {
    setProfileDialog((profileDialog) => ({
      ...profileDialog,
      menu: newMenu,
      tab: newMenu === "profile" ? "general" : "general",
    }));
  };

  const handleTabChange = (newTab: string) => {
    setProfileDialog((profileDialog) => ({
      ...profileDialog,
      tab: newTab as any,
    }));
  };

  const renderSidebarSection = (sectionKey: keyof typeof sidebarConfig) => {
    const section = sidebarConfig[sectionKey];

    return (
      <SidebarGroup key={sectionKey}>
        <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {section.items.map((item) => {
              const IconComponent = item.icon;
              const isActive = menu === sectionKey && tab === item.id;

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={isActive}
                    onClick={() => {
                      handleMenuChange(sectionKey);
                      handleTabChange(item.id);
                    }}
                    className="w-full justify-start"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setProfileDialog((profileDialog) => {
          if (!v) {
            return { open: false };
          }
          return { ...profileDialog, open: true };
        });
      }}
    >
      <DialogTrigger>
        <span />
      </DialogTrigger>
      <DialogContent
        aria-describedby="profile and organisation settings"
        className="w-[960px] h-[480px] max-w-full p-0 flex flex-col gap-0 rounded-[6px] border border-black-light"
      >
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-[224px] ">
            <SidebarContent className="p-3">
              {/* Render sidebar sections dynamically */}
              {renderSidebarSection("profile")}
              {renderSidebarSection("organisation")}
            </SidebarContent>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
              <span className="text-[var(--muted-foreground)]">
                {PROFILE_DIALOG_MENU[menu]?.text ?? menu}
              </span>
              <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]" />
              <span className="text-[var(--foreground)]">
                {PROFILE_DIALOG_TABS[menu][
                  tab as keyof (typeof PROFILE_DIALOG_TABS)[typeof menu]
                ]?.text ?? tab}
              </span>
            </div>

            {/* Content */}
            <DialogInner />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
