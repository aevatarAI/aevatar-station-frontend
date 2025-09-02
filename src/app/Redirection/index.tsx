import { type IProjectItem, getProjectList } from "@/api/utils/organization";
import { getRecentUsed } from "@/api/utils/project";
import Loading from "@/components/PageLoading";
import { useNavigate } from "@/hooks/navigate";
import { useCreateDefaultProject } from "@/hooks/useCreateDefaultProject";
import { useGetOrganizations } from "@/hooks/useGetOrganizations";
import { getProjects } from "@/hooks/useGetProjects";
import { usePermissionNavigate } from "@/hooks/usePermissionNavigate";
import useSetCurrentProject from "@/hooks/useSetCurrentProject";
import {
  CURRENT_ORGANIZATION_ATOM,
  ORGANIZATIONS_LIST_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import { delay } from "@/utils/common";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { useSearchParams } from "wouter";

const Redirection = () => {
  const navigate = useNavigate();
  const { data } = useGetOrganizations();
  const [, setCurrentOrganisationId] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const setCurrentProject = useSetCurrentProject();
  const { to } = usePermissionNavigate();
  const [, setOrganisations] = useAtom(ORGANIZATIONS_LIST_ATOM);
  const [, setProjectList] = useAtom(PROJECT_LIST_ATOM);
  const createDefaultProject = useCreateDefaultProject();
  const [searchParams] = useSearchParams();

  const getRecentUsedData = useCallback(async () => {
    try {
      const recentUsedData = await getRecentUsed();
      const recentUsdedProjectId = recentUsedData.projectId;
      const recentUsdedOrgId = recentUsedData.organizationId;
      if (!recentUsdedProjectId || !recentUsdedOrgId) return null;

      const projectList = await getProjectList(recentUsdedOrgId);
      const projectInfo = projectList.find(
        (item: IProjectItem) => item.id === recentUsdedProjectId,
      );
      if (!projectInfo) return null;
      return {
        organizationId: recentUsdedOrgId,
        curProject: projectInfo,
        projectList,
      };
    } catch (error) {
      return null;
    }
  }, []);

  const fetchProjectsThenRedirect = useCallback(async () => {
    let organizationIds = data.data.items.map((datum: any) => datum.id);
    const orgId = searchParams.get("orgId");

    if (orgId && organizationIds.includes(orgId)) {
      organizationIds = [orgId];
    }

    if (organizationIds.length === 0) {
      return navigate("/welcome");
    }

    setOrganisations(data.data.items);

    const recentUsedData = await getRecentUsedData();
    if (
      recentUsedData &&
      organizationIds.includes(recentUsedData.organizationId)
    ) {
      setCurrentOrganisationId(recentUsedData.organizationId);
      setProjectList(recentUsedData.projectList);
      await delay(0);
      setCurrentProject(
        recentUsedData.curProject.id,
        recentUsedData.curProject.domainName,
      );
      navigate("/dashboard/workflows");
      return;
    }

    const projectsPromises = organizationIds.map((id: string) =>
      getProjects(id),
    );

    try {
      let hasProjects = false;
      const proRes = await Promise.allSettled(projectsPromises);
      const responses = proRes
        .map((res, index) => {
          if (res.status === "fulfilled") {
            return { ...res.value, orgId: organizationIds[index] };
          }
          return null;
        })
        .filter((res) => res);
      console.log(responses, "response==");
      for (const index in responses) {
        const response = responses[index];
        if (!response) continue;
        if (response.code === "20000" && response.data.items.length > 0) {
          hasProjects = true;
          setCurrentOrganisationId(response.orgId);
          setProjectList(response.data.items);
          await delay(0);
          setCurrentProject(
            response.data.items[0].id,
            response.data.items[0].domainName,
          );
          break;
        }
      }
      if (!hasProjects) {
        setCurrentOrganisationId(organizationIds[0]);
        // await createDefaultProject(organizationIds[0]);
        navigate("/profile/organisation/project?action=create");
      } else {
        navigate(hasProjects ? to : "/profile");
      }
    } catch (_e) {
      console.log(_e, "response==");
      navigate("/profile");
    }
  }, [
    data,
    to,
    searchParams,
    getRecentUsedData,
    setCurrentOrganisationId,
    navigate,
    setCurrentProject,
    setOrganisations,
    setProjectList,
  ]);

  useEffect(() => {
    fetchProjectsThenRedirect();
  }, [fetchProjectsThenRedirect]);

  return <Loading />;
};

export default Redirection;
