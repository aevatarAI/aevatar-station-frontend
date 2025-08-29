import { request } from "@/api";
import Add from "@/assets/+.svg?react";
import Plus from "@/assets/+.svg?react";
import StepSelect from "@/assets/step_select.svg?react";
import ProjectEditDialog, {
  type IProjectEditDialogRef,
} from "@/components/ProjectEditDialog";
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
import { useNavigate } from "@/hooks/navigate";

import { useIsAdmin } from "@/hooks/useIsAdmin";
import useSetCurrentProject from "@/hooks/useSetCurrentProject";
import { useUpdateProjectHandler } from "@/hooks/useUpdateOrganisations";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_PROJECT_ATOM,
  ORGANIZATIONS_LIST_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useMemo, useRef, useState } from "react";

export interface Project {
  id: string;
  displayName: string;
  domainName: string;
  memberCount: number;
  creationTime: number;
}

export interface IOriganisactionHeaderProps {
  className?: string;
}

export default function OriganisactionHeader({
  className,
}: IOriganisactionHeaderProps) {
  const navigate = useNavigate();
  const [orgOpen, setOrgOpen] = useState<boolean>();
  const [pjtOpen, setPjtOpen] = useState<boolean>();
  const updateProjectListHandler = useUpdateProjectHandler();

  const setCurrentProject = useSetCurrentProject();

  const [organisationList] = useAtom(ORGANIZATIONS_LIST_ATOM);
  const [projectList] = useAtom(PROJECT_LIST_ATOM);
  const isAdmin = useIsAdmin();

  const [currentOrganisationId, setCurrentOrganisationId] = useAtom(
    CURRENT_ORGANIZATION_ATOM,
  );
  const currentOrganisation = useMemo(
    () =>
      organisationList?.find((item: any) => item.id === currentOrganisationId),
    [organisationList, currentOrganisationId],
  );

  const [currentProjectId] = useAtom(CURRENT_PROJECT_ATOM);
  const currentProject = useMemo(
    () =>
      projectList?.find((project: Project) => project.id === currentProjectId),
    [projectList, currentProjectId],
  );

  const projectEditDialogRef = useRef<IProjectEditDialogRef>(null);

  // const onCheckProjectService = useCallback(
  //   async (domainName: string, projectId: string) => {
  //     setPjtOpen(false);
  //     setProjectInitialising(true);
  //     await checkProjectService(domainName);
  //     setProjectInitialising(false);
  //     setCurProjectId(projectId);

  //     navigate("/dashboard/workflows");
  //   },
  //   [checkProjectService, navigate, setProjectInitialising, setCurProjectId]
  // );

  return (
    <div
      className={clsx(
        "flex text-[14px] gap-[14px] items-center text-[var(--color-foreground)] font-outfit font-normal leading-normal ",
        className,
      )}
    >
      {currentOrganisation ? (
        <Popover open={orgOpen} onOpenChange={setOrgOpen}>
          <PopoverTrigger className="flex items-center gap-[8px] py-[4px] px-[6px]">
            {currentOrganisation?.displayName ?? "--"}
            <StepSelect />
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

            {/* <div className="flex justify-center lg:pt-[20px] lg:px-[12px] border-t border-[var(--color-border-black-light)]">
              <Button className="text-[var(--color-foreground)] w-full text-center font-outfit text-[13px] font-semibold py-[7px] leading-[14px] lowercase" onClick={() => {
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
        <div className="text-[var(--color-foreground)] font-outfit text-[14px] font-normal leading-[14px]">
          No Organisation
        </div>
      )}
      <div>/</div>

      <Popover open={pjtOpen} onOpenChange={setPjtOpen}>
        <PopoverTrigger className="flex items-center gap-[8px] py-[4px] px-[6px]">
          {currentProject ? (
            currentProject.displayName
          ) : (
            <div className="text-[var(--color-foreground)] font-outfit text-[14px] font-normal leading-[18px]">
              No project
            </div>
          )}
          <StepSelect />
        </PopoverTrigger>
        <PopoverContent className="lg:p-0 lg:pb-[17px] left-0 lg:-top-[10px] w-[259px]">
          <div className="lg:pt-[9px] lg:pl-[10px] lg:pr-[8px] lg:pb-0 max-h-[300px] scrollbar-hide overflow-auto">
            {projectList?.map((item: Project) => (
              <div
                className={clsx(
                  itemClassName,
                  itemHoverClassName,
                  currentProject?.id === item.id && itemSelectClassName,
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
          <div className="flex flex-col items-center gap-[10px] justify-center pt-[20px] lg:px-[12px] border-t border-[var(--color-border-black-light)]">
            <Button
              disabled={!isAdmin}
              className={`text-[var(--color-foreground)] text-center font-outfit text-[13px] font-semibold py-[7px] leading-[14px] ${"w-full"}`}
              onClick={() => projectEditDialogRef.current?.open()}
            >
              <Plus />
              <span>create project</span>
            </Button>
            <Button
              className="text-[var(--color-foreground)] w-full text-center font-outfit text-[13px] font-semibold py-[7px] leading-[14px]"
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
