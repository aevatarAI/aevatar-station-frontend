import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_PROJECT_ATOM,
  ORGANIZATIONS_LIST_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import { useCallback } from "react";

export const useLogout = () => {
  const [, setOrganizationsList] = useAtom(ORGANIZATIONS_LIST_ATOM);
  const [, setCurrentOrganization] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const [, setProjectList] = useAtom(PROJECT_LIST_ATOM);
  const [, setCurrentProject] = useAtom(CURRENT_PROJECT_ATOM);

  return useCallback(() => {
    setOrganizationsList(RESET);
    setProjectList(RESET);
    setCurrentOrganization(RESET);
    setCurrentProject(RESET);
  }, [
    setOrganizationsList,
    setProjectList,
    setCurrentOrganization,
    setCurrentProject,
  ]);
};
