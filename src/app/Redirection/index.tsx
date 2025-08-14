import Loading from "@/components/PageLoading";
import { useNavigate } from "@/hooks/navigate";
import { useCreateDefaultProject } from "@/hooks/useCreateDefaultProject";
import { useGetOrganizations } from "@/hooks/useGetOrganizations";
import { getProjects } from "@/hooks/useGetProjects";
import { usePermissionNavigate } from "@/hooks/usePermissionNavigate";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_PROJECT_ATOM,
  ORGANIZATIONS_LIST_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useSearchParams } from "wouter";

const Redirection = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetOrganizations();
  const [, setCurrentOrganisationId] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const [, setCurrntProjectId] = useAtom(CURRENT_PROJECT_ATOM);
  const { to } = usePermissionNavigate();
  const [, setOrganisations] = useAtom(ORGANIZATIONS_LIST_ATOM);
  const [, setProjectList] = useAtom(PROJECT_LIST_ATOM);
  const createDefaultProject = useCreateDefaultProject();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (isLoading || !data) return;

    const fetchProjectsThenRedirect = async () => {
      let organizationIds = data.data.items.map((datum: any) => datum.id);
      const orgId = searchParams.get("orgId");

      if (orgId && organizationIds.includes(orgId)) {
        organizationIds = [orgId];
      }
      const projectsPromises = organizationIds.map((id: string) =>
        getProjects(id),
      );

      if (organizationIds.length === 0) {
        return navigate("/welcome");
      }

      setOrganisations(data.data.items);
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
            setCurrntProjectId(response.data.items[0].id);
            break;
          }
        }
        if (!hasProjects) {
          setCurrentOrganisationId(organizationIds[0]);
          await createDefaultProject(organizationIds[0]);
        } else {
          navigate(hasProjects ? to : "/profile");
        }
      } catch (_e) {
        console.log(_e, "response==");
        navigate("/profile");
      }
    };

    fetchProjectsThenRedirect();
  }, [
    data,
    isLoading,
    to,
    searchParams,
    setCurrentOrganisationId,
    navigate,
    setCurrntProjectId,
    setOrganisations,
    setProjectList,
    createDefaultProject,
  ]);

  return <Loading />;
};

export default Redirection;
