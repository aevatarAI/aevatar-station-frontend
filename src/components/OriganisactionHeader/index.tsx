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
import clsx from "clsx";
import { useState } from "react";
import StepSelect from "@/assets/step_select.svg?react";
import { Button } from "@/components/ui/button";
import Add from "@/assets/+.svg?react";

export interface IOriganisactionHeaderProps {
  className?: string;
}

const organisationList = [
  "organisation name #1",
  "organisation name #2",
  "organisation name #3",
];

const projectList = ["project name #1", "project name #2", "project name #3"];

export default function OriganisactionHeader({
  className,
}: IOriganisactionHeaderProps) {
  const [orgOpen, setOrgOpen] = useState<boolean>();
  const [pjtOpen, setPjtOpen] = useState<boolean>();

  const [organisation, setOrganisation] = useState<string>(organisationList[0]);
  const [project, setProject] = useState<string>(projectList[0]);

  return (
    <div
      className={clsx(
        "flex text-[14px] gap-[14px] items-center text-white font-source-code text-[14px] font-normal leading-normal ",
        className
      )}>
      <Popover open={orgOpen} onOpenChange={setOrgOpen}>
        <PopoverTrigger className="flex items-center gap-[8px] py-[4px] px-[6px] data-[state=open]:bg-[#303030]">
          {organisation}
          <StepSelect />
        </PopoverTrigger>
        <PopoverContent className="lg:p-0 lg:pb-[17px] left-[0] lg:-top-[10px] w-[259px]">
          <div className="lg:pt-[9px] lg:pl-[10px] lg:pr-[8px] lg:pb-[10px] max-h-[300px] scrollbar-hide overflow-auto">
            {organisationList.map((item) => (
              <div
                className={clsx(
                  itemClassName,
                  itemHoverClassName,
                  organisation === item && itemSelectClassName
                )}
                onClick={() => {
                  setOrganisation(item);
                  setOrgOpen(false);
                }}
                key={item}>
                {item}
              </div>
            ))}
          </div>

          <div className="flex justify-center lg:pt-[20px] lg:px-[12px] border-t border-[#303030] ">
            <Button className="text-white w-full text-center font-syne text-[12px] font-semibold leading-normal lowercase">
              <Add />
              create organisation
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <div>/</div>

      <Popover open={pjtOpen} onOpenChange={setPjtOpen}>
        <PopoverTrigger className="flex items-center gap-[8px] py-[4px] px-[6px] data-[state=open]:bg-[#303030]">
          {project}
          <StepSelect />
        </PopoverTrigger>
        <PopoverContent className="lg:p-0 lg:pb-[17px] left-[0] lg:-top-[10px] w-[259px]">
          <div className="lg:pt-[9px] lg:pl-[10px] lg:pr-[8px] lg:pb-[0] max-h-[300px] scrollbar-hide overflow-auto">
            {projectList.map((item) => (
              <div
                className={clsx(
                  itemClassName,
                  itemHoverClassName,
                  project === item && itemSelectClassName
                )}
                onClick={() => {
                  setProject(item);
                  setPjtOpen(false);
                }}
                key={item}>
                {item}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-[10px] justify-center lg:pt-[20px] lg:px-[12px] border-t border-[#303030] hidden">
            <Button className="text-white w-full text-center font-syne text-[12px] font-semibold leading-normal lowercase">
              <Add />
              create organisation
            </Button>
            <Button className="text-white w-full text-center font-syne text-[12px] font-semibold leading-normal lowercase">
              <Add />
              create organisation
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
