import Add from "@/assets/+.svg?react";
import StepSelect from "@/assets/step_select.svg?react";
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
import { useGetOrganizations } from "@/hooks/useGetOrganizations";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_PROJECT_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";

export interface IOriganisactionHeaderProps {
  className?: string;
}

export default function OriganisactionHeader({
  className,
}: IOriganisactionHeaderProps) {
  const [orgOpen, setOrgOpen] = useState<boolean>();
  const [pjtOpen, setPjtOpen] = useState<boolean>();
  const { data: organisationList, refetch } = useGetOrganizations();
  const [currentOrganisationId, setCurrentOrganisationId] = useAtom(
    CURRENT_ORGANIZATION_ATOM,
  );

  const [projectList] = useAtom(PROJECT_LIST_ATOM);
  const [currentProjectId, setCurrentProjectId] = useAtom(CURRENT_PROJECT_ATOM);
  const currentOrganisation = useMemo(
    () =>
      organisationList?.data?.items.find(
        (item: any) => item.id === currentOrganisationId,
      ),
    [organisationList?.data?.items, currentOrganisationId],
  );

  const currentProject = useMemo(
    () => projectList.find((item) => item.id === currentProjectId),
    [projectList, currentProjectId],
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
            <div className="lg:pt-[9px] lg:pl-[10px] lg:pr-[8px] lg:pb-[10px] max-h-[300px] scrollbar-hide overflow-auto">
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

            {/* <div className="flex justify-center lg:pt-[20px] lg:px-[12px] border-t border-[#303030] ">
            <Button className="text-white w-full text-center font-syne text-[12px] font-semibold py-[7px] leading-[14px] lowercase">
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

      {currentProject ? (
        <Popover open={pjtOpen} onOpenChange={setPjtOpen}>
          <PopoverTrigger className="flex items-center gap-[8px] py-[4px] px-[6px] data-[state=open]:bg-[#303030]">
            {currentProject?.displayName ?? "--"}
            <StepSelect />
          </PopoverTrigger>
          <PopoverContent className="lg:p-0 lg:pb-[17px] left-[0] lg:-top-[10px] w-[259px]">
            <div className="lg:pt-[9px] lg:pl-[10px] lg:pr-[8px] lg:pb-[0] max-h-[300px] scrollbar-hide overflow-auto">
              {projectList.map((item) => (
                <div
                  className={clsx(
                    itemClassName,
                    itemHoverClassName,
                    currentProject?.id === item.id && itemSelectClassName,
                  )}
                  onClick={() => {
                    setCurrentProjectId(item.id);
                    setPjtOpen(false);
                  }}
                  key={item.id}
                >
                  {item?.displayName ?? "--"}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-[10px] justify-center lg:pt-[20px] lg:px-[12px] border-t border-[#303030] hidden">
              <Button className="text-white w-full text-center font-syne text-[12px] font-semibold py-[7px] leading-[14px] lowercase">
                <Add />
                create organisation
              </Button>
              <Button className="text-white w-full text-center font-syne text-[12px] font-semibold py-[7px] leading-[14px] lowercase">
                <Add />
                create project
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="text-white font-source-code text-[14px] font-normal leading-[18px] lowercase">
          No project
        </div>
      )}
    </div>
  );
}
