import { getOrganizationList, getProjectList } from "@/api/utils/organization";
import { useToast } from "@/hooks/use-toast";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_PROJECT_ATOM,
  ORGANIZATIONS_LIST_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import { handleErrorMessage } from "@etransfer/utils";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

export const useUpdateOrganisations = () => {
  const [, setOrganisations] = useAtom(ORGANIZATIONS_LIST_ATOM);
  const [curOrg, setCurOrganisations] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const [, setProjectList] = useAtom(PROJECT_LIST_ATOM);
  const [curProject, setCurProject] = useAtom(CURRENT_PROJECT_ATOM);
  const { toast } = useToast();

  const updateProjectList = useCallback(
    async (id: string) => {
      try {
        const list = await getProjectList(id);
        if (!list.length) return;
        const isSome = list.some((item) => item.id === curProject);

        const curId = isSome && curProject ? curProject : list[0].id;
        setProjectList(list);
        if (!curProject) setCurProject(curId);
      } catch (error) {
        toast({
          description: handleErrorMessage(error, "fetch Project error"),
        });
      }
    },
    [setProjectList, setCurProject, toast, curProject]
  );

  const updateOrganizationList = useCallback(async () => {
    try {
      const list = await getOrganizationList();
      console.log(list, "list==a");
      setOrganisations(list);

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

  useEffect(() => {
    updateOrganizationList();
  }, [updateOrganizationList]);
};
