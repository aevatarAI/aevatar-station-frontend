import Add from "@/assets/+.svg?react";
import StepSelect from "@/assets/step_select.svg?react";
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
import { useNavigate } from "@/hooks/navigate";
import { useToast } from "@/hooks/use-toast";
import { useCreateProject } from "@/hooks/useCreateProject";
import { useGetOrganizations } from "@/hooks/useGetOrganizations";
import { useGetProjects } from "@/hooks/useGetProjects";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_PROJECT_ATOM,
} from "@/state/atoms/organisation";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";

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
  const { data: organisationList, refetch } = useGetOrganizations();
  const { data: projectList } = useGetProjects();
  const { mutate } = useCreateProject();
  const isAdmin = useIsAdmin();
  const { toast } = useToast();

  const [currentOrganisationId, setCurrentOrganisationId] = useAtom(
    CURRENT_ORGANIZATION_ATOM,
  );
  const currentOrganisation = useMemo(
    () =>
      organisationList?.data?.items.find(
        (item: any) => item.id === currentOrganisationId,
      ),
    [organisationList?.data?.items, currentOrganisationId],
  );

  const [currentProjectId, setCurrentProjectId] = useAtom(CURRENT_PROJECT_ATOM);
  const currentProject = useMemo(
    () =>
      projectList?.data?.items.find(
        (project: Project) => project.id === currentProjectId,
      ),
    [projectList?.data?.items, currentProjectId],
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div
      className={clsx(
        "flex text-[14px] gap-[14px] items-center text-white font-source-code text-[14px] font-normal leading-normal ",
        className,
      )}
    >
      {currentOrganisation ? (
        <Popover open={orgOpen} onOpenChange={setOrgOpen}>
          <PopoverTrigger className="flex items-center gap-[8px] py-[4px] px-[6px] data-[state=open]:bg-[#303030]">
            {currentOrganisation?.displayName ?? "--"}
            <StepSelect />
          </PopoverTrigger>
          <PopoverContent className="lg:p-0 lg:pb-[17px] left-[0] lg:-top-[10px] w-[259px]">
            <div className="lg:p-[8px] max-h-[300px] scrollbar-hide overflow-auto">
              {organisationList?.data?.items.map((item: any) => (
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

            {/* <div className="flex justify-center lg:pt-[20px] lg:px-[12px] border-t border-[#303030]">
              <Button className="text-white w-full text-center font-syne text-[12px] font-semibold py-[7px] leading-[14px] lowercase" onClick={() => {
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
        <div className="text-white font-source-code text-[14px] font-normal leading-[18px] lowercase">
          No Organisation
        </div>
      )}
      <div>/</div>

      <Popover open={pjtOpen} onOpenChange={setPjtOpen}>
        <PopoverTrigger className="flex items-center gap-[8px] py-[4px] px-[6px] data-[state=open]:bg-[#303030]">
          {currentProject ? (
            currentProject.displayName
          ) : (
            <div className="text-white font-source-code text-[14px] font-normal leading-[18px] lowercase">
              No project
            </div>
          )}
          <StepSelect />
        </PopoverTrigger>
        <PopoverContent className="lg:p-0 lg:pb-[17px] left-[0] lg:-top-[10px] w-[259px]">
          <div className="lg:pt-[9px] lg:pl-[10px] lg:pr-[8px] lg:pb-[0] max-h-[300px] scrollbar-hide overflow-auto">
            {projectList?.data?.items?.map((item: Project) => (
              <div
                className={clsx(
                  itemClassName,
                  itemHoverClassName,
                  currentProject?.id === item.id && itemSelectClassName,
                )}
                onClick={() => {
                  setCurrentProjectId(() => item.id);
                  setPjtOpen(false);
                }}
                key={item.id}
              >
                {item?.displayName ?? "--"}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-[10px] justify-center pt-[20px] lg:px-[12px] border-t border-[#303030]">
            <ProjectEditDialog
              type="create"
              disabled={!isAdmin}
              fullWidth={true}
              onSubmit={async ({ name, domainName }) => {
                mutate(
                  {
                    organizationId: currentOrganisationId as string,
                    displayName: name,
                    domainName,
                  },
                  {
                    onError: () => {
                      toast({ description: "unable to create project" });
                    },
                  },
                );
                navigate("/profile/organisation/project");
                setPjtOpen(false);
              }}
            />
            <Button
              className="text-white w-full text-center font-syne text-[12px] font-semibold py-[7px] leading-[14px] lowercase"
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
    </div>
  );
}
