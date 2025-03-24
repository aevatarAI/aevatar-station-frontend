import { getOrganizationList, getProjectList } from "@/api/utils/organization";
import { toast, useToast } from "@/hooks/use-toast";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_PROJECT_ATOM,
  ORGANIZATIONS_LIST_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import { handleErrorMessage } from "@/utils/error";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

export const useUpdateProjectHandler = () => {
  const [, setProjectList] = useAtom(PROJECT_LIST_ATOM);
  const [curProject, setCurProject] = useAtom(CURRENT_PROJECT_ATOM);
  const { toast } = useToast();

  return useCallback(
    async (id: string) => {
      try {
        const list = await getProjectList(id);
        if (!list.length) {
          setProjectList(list);
          setCurProject(null);
          return;
        }
        const isSome = list.some((item) => item.id === curProject);

        const curId = isSome && curProject ? curProject : list[0].id;

        setProjectList(list);
        if (!isSome) setCurProject(curId);
      } catch (error) {
        toast({
          description: handleErrorMessage(error, "fetch Project error"),
        });
      }
    },
    [setProjectList, setCurProject, toast, curProject],
  );
};

export const useUpdateOrganisationsHandler = () => {
  const [, setOrganisations] = useAtom(ORGANIZATIONS_LIST_ATOM);
  const [curOrg, setCurOrganisations] = useAtom(CURRENT_ORGANIZATION_ATOM);

  const { toast } = useToast();

  const updateProjectList = useUpdateProjectHandler();

  return useCallback(async () => {
    try {
      const list = await getOrganizationList();

      setOrganisations(list);
      if (!list.length) {
        setCurOrganisations(null);
        return;
      }
      const isSome = list.some((item) => item.id === curOrg);
      const curId = isSome && curOrg ? curOrg : list[0].id;
      if (!isSome) setCurOrganisations(curId);
      updateProjectList(curId);
    } catch (error) {
      toast({
        description: handleErrorMessage(error, "fetch Organisations error"),
      });
    }
  }, [curOrg, setOrganisations, setCurOrganisations, toast, updateProjectList]);
};

export const useUpdateOrganisations = () => {
  const updateOrganizationList = useUpdateOrganisationsHandler();

  useEffect(() => {
    updateOrganizationList();
  }, [updateOrganizationList]);
};
