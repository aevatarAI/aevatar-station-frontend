import { createDefaultWorkflow } from "@/api/utils/apiWithDomain";
import { createDefaultProject, getProjectList } from "@/api/utils/organization";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@/hooks/navigate";
import { toast } from "@/hooks/use-toast";
import { useCheckProjectService } from "@/hooks/useCheckProjectService";
import { useGetOrgPermissions } from "@/hooks/useOrgPermissions";
import { useGetProjectPermissions } from "@/hooks/useProjectPermissions";
import {
  projectInitialisingAtom,
  projectInitialisingLoadingAtom,
} from "@/state/atoms";
import {
  CURRENT_PROJECT_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import { delay } from "@/utils/common";
import { handleErrorMessage } from "@/utils/error";
import { useAtom } from "jotai";
import { useCallback } from "react";
export const useCreateDefaultProject = () => {
  const [, setProjectInitialisingLoading] = useAtom(
    projectInitialisingLoadingAtom,
  );
  const [, setProjectList] = useAtom(PROJECT_LIST_ATOM);
  const navigate = useNavigate();
  const checkProjectService = useCheckProjectService();
  const [, setCurrntProjectId] = useAtom(CURRENT_PROJECT_ATOM);
  const getOrgPermissions = useGetOrgPermissions();
  const getProjectPermissions = useGetProjectPermissions();
  const [, setProjectInitialising] = useAtom(projectInitialisingAtom);
  const createProject = useCallback(
    async (organizationId: string) => {
      try {
        const response = await createDefaultProject({
          organizationId,
        });
        await delay(500);
        const list = await getProjectList(organizationId);
        setProjectList(list);

        return response;
      } catch (error) {
        const { dismiss } = toast({
          description: `failed to create default project: ${handleErrorMessage(
            error,
            "error",
          )}`,
          duration: 10000,
          action: (
            <Button
              className="border-[#303030]"
              onClick={(e) => {
                e.stopPropagation();
                dismiss();
                createProjectAndWorkflow(organizationId);
              }}
            >
              retry
            </Button>
          ),
        });
        return null;
      }
    },
    [setProjectList],
  );

  const createWorkflow = useCallback(async (domain: string) => {
    try {
      const response = await createDefaultWorkflow(domain);
      return response;
    } catch (error) {
      toast({
        description: handleErrorMessage(
          error,
          "Failed to create default workflow",
        ),
      });
      return null;
    }
  }, []);

  const createProjectAndWorkflow = useCallback(
    async (organizationId: string) => {
      setProjectInitialisingLoading(true);
      await delay(500);
      const userPermissions = await getOrgPermissions(organizationId);
      if (!userPermissions.projectsCreate) {
        setProjectInitialisingLoading(false);
        navigate("/profile");
        return;
      }
      const project = await createProject(organizationId);
      if (!project) {
        setProjectInitialisingLoading(false);
        navigate("/profile/organisation/project?action=create");

        return {};
      }
      setCurrntProjectId(project.id);
      await checkProjectService(project.domainName);

      setProjectInitialising((prev) => {
        const newArray = [...(prev ?? [])];
        if (!newArray.includes(project.id)) {
          newArray.push(project.id);
        }
        return newArray;
      });

      getProjectPermissions(project.id);
      const workflowInfo = await createWorkflow(project.domainName);
      delay(500).then(() => {
        setProjectInitialisingLoading(false);
      });
      console.log(workflowInfo, "workflowInfo===");
      if (!workflowInfo) {
        navigate("/dashboard/workflows");
        return;
      }
      if (workflowInfo) {
        navigate(`/dashboard/workflows?workflowId=${workflowInfo.id}`);
        return;
      }
      return { project, workflow: workflowInfo };
    },
    [
      navigate,
      getOrgPermissions,
      setCurrntProjectId,
      createProject,
      checkProjectService,
      setProjectInitialisingLoading,
      createWorkflow,
      setProjectInitialising,
      getProjectPermissions,
    ],
  );

  return createProjectAndWorkflow;
};
