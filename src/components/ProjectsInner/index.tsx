import { request } from "@/api";
import { getOrganizationMembers } from "@/api/utils/organization";
import General from "@/components/General";
import ProjectMember from "@/components/ProjectMember";
import ProjectRole from "@/components/ProjectRole";
import type { TAB_LIST } from "@/constants/sideBar";
import { useToast } from "@/hooks/use-toast";
import {
  CURRENT_ORGANIZATION_ATOM,
  ORGANIZATION_MEMBER_ATOM,
} from "@/state/atoms/organisation";
import { handleErrorMessage, sleep } from "@etransfer/utils";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

interface IOrganisationInnerProps {
  tab: (typeof TAB_LIST)[number];
}
const ProjectsInner = ({ tab }: IOrganisationInnerProps) => {
  const { toast } = useToast();

  const onNameSave = useCallback(
    async (displayName: string) => {
      try {
        await request.projects.editProject({
          data: { displayName },
        });
        toast({
          description: "successfully saved",
        });
      } catch (error) {
        toast({
          description: handleErrorMessage(error),
        });
      }
    },
    [toast]
  );

  const [organizationId] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const [, setMemberList] = useAtom(ORGANIZATION_MEMBER_ATOM);

  const updateOrganizationMembers = useCallback(async () => {
    try {
      if (!organizationId) return;
      const result = await getOrganizationMembers(organizationId);
      setMemberList(result);
    } catch (error) {
      toast({
        description: handleErrorMessage(error),
      });
    }
  }, [toast, organizationId, setMemberList]);

  useEffect(() => {
    updateOrganizationMembers();
  }, [updateOrganizationMembers]);

  return (
    <div>
      {tab === "general" && (
        <General
          header="project settings"
          title={"project name"}
          inputPlaceholder="name"
          buttonProps={{ placement: "bottom-left" }}
          onConfirm={onNameSave}
        />
      )}
      {tab === "member" && <ProjectMember />}
      {tab === "role" && <ProjectRole />}
    </div>
  );
};
export default ProjectsInner;
