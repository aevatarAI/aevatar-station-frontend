import { getOrganizationRoles } from "@/api/utils/organization";
import { getProjectRoles } from "@/api/utils/project";
import OrganisationInner from "@/components/OrganisationInner";
import ProfileInner from "@/components/ProfileInner";
import ProjectsInner from "@/components/ProjectsInner";
import { SideBar } from "@/components/SideBar";
import { useLongPollUnreadNotifications } from "@/hooks/useLongPollUnreadNotifications";
import { useSideBarParams } from "@/hooks/useSideBarParams";
import { useUpdateOrganisations } from "@/hooks/useUpdateOrganisations";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_ORGANIZATION_ROLE_ATOM,
  CURRENT_PROJECT_ATOM,
  CURRENT_PROJECT_ROLE_ATOM,
} from "@/state/atoms/organisation";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

export default function Profile() {
  const [selectMenu, selectTab] = useSideBarParams();
  useUpdateOrganisations();
  useLongPollUnreadNotifications();
  const [, setOrganisationRoles] = useAtom(CURRENT_ORGANIZATION_ROLE_ATOM);
  const [currentOrganisationId] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const getOrganisationRoleList = useCallback(async () => {
    if (!currentOrganisationId) return;
    const result = await getOrganizationRoles(currentOrganisationId);
    setOrganisationRoles(result);
  }, [currentOrganisationId, setOrganisationRoles]);

  useEffect(() => {
    getOrganisationRoleList();
  }, [getOrganisationRoleList]);

  const [, setProjectRoles] = useAtom(CURRENT_PROJECT_ROLE_ATOM);

  const [projectId] = useAtom(CURRENT_PROJECT_ATOM);

  const getProjectRoleList = useCallback(async () => {
    if (!projectId) return;
    const result = await getProjectRoles(projectId);
    setProjectRoles(result);
  }, [projectId, setProjectRoles]);

  useEffect(() => {
    getProjectRoleList();
  }, [getProjectRoleList]);

  return (
    <div className="flex flex-col lg:flex-row  h-[calc(100vh-60px)]">
      {/* <div className="hidden lg:block w-[200px] bg-[#191919] min-w-[200px]">
        <SideBar />
      </div> */}
      <div className="pt-[31px] lg:pt-[39px] px-[20px] lg:pl-[43px] lg:pr-[40px] flex-1 overflow-auto">
        {selectMenu === "profile" && <ProfileInner tab={selectTab} />}
        {selectMenu === "organisation" && <OrganisationInner tab={selectTab} />}
        {selectMenu === "projects" && <ProjectsInner tab={selectTab} />}
      </div>
    </div>
  );
}
