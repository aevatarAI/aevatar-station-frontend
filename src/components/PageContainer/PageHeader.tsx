import { request } from "@/api";
import Add from "@/assets/+.svg?react";
import Plus from "@/assets/+.svg?react";
import StepSelect from "@/assets/chevrons-up-down.svg?react";
import Notication from "@/assets/notication.svg?react";
import NoticationEmpty from "@/assets/notification_empty.svg?react";
import type { Project } from "@/components/OriganisactionHeader";
import ProfileAvatar from "@/components/ProfileAvatar";
import type { IProjectEditDialogRef } from "@/components/ProjectEditDialog";
import ProjectEditDialog from "@/components/ProjectEditDialog";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  itemClassName,
  itemHoverClassName,
  itemSelectClassName,
} from "@/constants/cls";
import { MENU_MAP_LIST } from "@/constants/sideBar";
import { useNavigate } from "@/hooks/navigate";
import { useCurrentProject } from "@/hooks/useCurrentProject";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { usePostReadNotifications } from "@/hooks/usePostReadNotifications";
import useSetCurrentProject from "@/hooks/useSetCurrentProject";
import { useSideBarParams } from "@/hooks/useSideBarParams";
import { useUpdateProjectHandler } from "@/hooks/useUpdateOrganisations";
import { UNREAD_NOTIFICATION_ATOM } from "@/state/atoms/notification";
import {
  CURRENT_ORGANIZATION_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useRef, useState } from "react";

export default function PageHeader() {
  const project = useCurrentProject();
  const { mutate } = usePostReadNotifications();
  const [unreadNotifications] = useAtom(UNREAD_NOTIFICATION_ATOM);
  const navigate = useNavigate();
  const [, selectTab] = useSideBarParams();
  console.log(selectTab, "selectTab=");

  const [pjtOpen, setPjtOpen] = useState<boolean>();
  const [projectList] = useAtom(PROJECT_LIST_ATOM);
  const setCurrentProject = useSetCurrentProject();
  const projectEditDialogRef = useRef<IProjectEditDialogRef>(null);
  const isAdmin = useIsAdmin();

  const [currentOrganisationId] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const updateProjectListHandler = useUpdateProjectHandler();

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="h-4 w-px border-[var(--sidebar-border)] border-r" />

        <Popover open={pjtOpen} onOpenChange={setPjtOpen}>
          <PopoverTrigger className="flex items-center gap-[8px] py-[4px] px-[6px] data-[state=open]:bg-black-light">
            {project ? (
              project.displayName
            ) : (
              <div className="text-white font-outfit text-[14px] font-normal leading-[18px] lowercase">
                No project
              </div>
            )}
            <StepSelect className="text-[var(--muted-foreground)]" />
          </PopoverTrigger>
          <PopoverContent className="lg:p-0 lg:pb-[17px] left-0 lg:-top-[10px] w-[259px]">
            <div className="lg:pt-[9px] lg:pl-[10px] lg:pr-[8px] lg:pb-0 max-h-[300px] scrollbar-hide overflow-auto">
              {projectList?.map((item: Project) => (
                <div
                  className={clsx(
                    itemClassName,
                    itemHoverClassName,
                    project?.id === item.id && itemSelectClassName,
                  )}
                  onClick={() => {
                    setCurrentProject(item.id, item.domainName);
                    setPjtOpen(false);
                  }}
                  key={item.id}
                >
                  {item?.displayName ?? "--"}
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center gap-[10px] justify-center pt-[20px] lg:px-[12px] border-t border-black-light">
              <Button
                disabled={!isAdmin}
                className={`text-white text-center font-outfit text-[13px] font-semibold py-[7px] leading-[14px] lowercase ${"w-full"}`}
                onClick={() => projectEditDialogRef.current?.open()}
              >
                <Plus />
                <span>create project</span>
              </Button>
              <Button
                className="text-white w-full text-center font-outfit text-[13px] font-semibold py-[7px] leading-[14px] lowercase"
                disabled={!isAdmin}
                onClick={() => {
                  navigate("/profile/organisation/project");
                  setPjtOpen(false);
                }}
              >
                <Add />
                manage projects
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="text-[var(--muted-foreground)]">/</div>

        <p className="text-sm text-muted-foreground">
          {MENU_MAP_LIST[selectTab as keyof typeof MENU_MAP_LIST]?.text ?? ""}
        </p>
      </div>
      <div className="flex items-center gap-4">
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          onClick={() => {
            mutate();
            navigate("/profile/profile/notifications");
          }}
        >
          {unreadNotifications ? (
            <Notication />
          ) : (
            <NoticationEmpty className="text-white" />
          )}
        </button>
        <ProfileAvatar />
      </div>

      <ProjectEditDialog
        type="create"
        ref={projectEditDialogRef}
        disabled={!isAdmin}
        showCreateButton={false}
        fullWidth={true}
        // onCheckProjectService={onCheckProjectService}
        onSubmit={async ({ name, domainName }) => {
          const result = await request.projects.addProject({
            data: {
              organizationId: currentOrganisationId,
              displayName: name,
              domainName,
            },
          });

          await updateProjectListHandler(currentOrganisationId || "");
          setCurrentProject(result.data.id, result.data.domainName);
          setPjtOpen(false);
          navigate("/dashboard/workflows");
          return { projectId: result.data.id };
        }}
      />
    </div>
  );
}
