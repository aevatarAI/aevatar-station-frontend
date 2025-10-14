import { request } from "@/api";
import General, { type IGeneralInstance } from "@/components/General";
import ProjectMember from "@/components/ProjectMember";
import ProjectRole from "@/components/ProjectRole";
import { Input } from "@/components/ui/input";
import type { TAB_LIST } from "@/constants/sideBar";
import { useToast } from "@/hooks/use-toast";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import { useUpdateProjectHandler } from "@/hooks/useUpdateOrganisations";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_PROJECT_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import { handleErrorMessage } from "@/utils/error";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface IOrganisationInnerProps {
  tab: (typeof TAB_LIST)[number];
}
const ProjectsInner = ({ tab }: IOrganisationInnerProps) => {
  const { toast } = useToast();
  const [projectId] = useAtom(CURRENT_PROJECT_ATOM);
  const [projectList] = useAtom(PROJECT_LIST_ATOM);
  const userProjectPermissions = useProjectPermissions();

  const updateProjectList = useUpdateProjectHandler();

  const [organizationId] = useAtom(CURRENT_ORGANIZATION_ATOM);

  const curProject = useMemo(
    () => projectList.find((item) => item.id === projectId),
    [projectList, projectId],
  );

  const [domainName, setDomainName] = useState<string>(
    curProject?.domainName ?? "",
  );

  const generalRef = useRef<IGeneralInstance>();

  useEffect(() => {
    setDomainName(curProject?.domainName ?? "");
    generalRef.current?.updateInput(curProject?.displayName ?? "");
  }, [curProject?.domainName, curProject?.displayName]);

  const onNameSave = useCallback(
    async (displayName: string) => {
      if (!projectId || !organizationId) return;
      // if (!domainName) return;
      try {
        await request.projects.editProject({
          query: projectId,
          data: { displayName },
        });
        toast({
          description: "Successfully saved",
        });
        updateProjectList(organizationId);
      } catch (error) {
        toast({
          description: handleErrorMessage(error),
        });
      }
    },
    [toast, projectId, organizationId, updateProjectList],
  );

  const extraInput = useMemo(
    () => (
      <div className="pt-[20px] ">
        <div className="text-[var(--color-foreground)] font-geist text-[13px] pb-[10px] font-semibold leading-normal ">
          Domain Name
        </div>
        <Input
          className="max-w-[498px] disabled:opacity-100"
          disabled
          // disabled={!userProjectPermissions?.projectsEdit}
          placeholder={curProject?.domainName ?? "Domain name"}
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
        />
      </div>
    ),
    [domainName, curProject?.domainName],
  );

  return (
    <div>
      {tab === "general" && (
        <General
          ref={generalRef}
          header="Project Settings"
          title={"Project Name"}
          readonly={!userProjectPermissions?.projectsEdit}
          inputPlaceholder={curProject?.displayName ?? "Name"}
          defaultValue={curProject?.displayName}
          buttonProps={{ placement: "bottom-left" }}
          extraInput={extraInput}
          onConfirm={onNameSave}
        />
      )}
      {tab === "member" && <ProjectMember />}
      {tab === "role" && <ProjectRole />}
    </div>
  );
};
export default ProjectsInner;
