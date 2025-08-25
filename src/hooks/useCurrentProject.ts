import {
  CURRENT_PROJECT_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import { useAtom } from "jotai";
import { useMemo } from "react";

export const useCurrentProject = () => {
  const [projectId] = useAtom(CURRENT_PROJECT_ATOM);
  const [projectList] = useAtom(PROJECT_LIST_ATOM);
  return useMemo(() => {
    if (!Array.isArray(projectList)) return null;
    const project = projectList.find((item) => item.id === projectId);
    if (project) {
      return {
        ...project,
        // domainName: "developer",
      };
    }
    return null;
  }, [projectList, projectId]);
};
