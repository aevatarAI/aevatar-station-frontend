import { getDomainBaseUrl } from "@/api/list";
import { CURRENT_PROJECT_ATOM } from "@/state/atoms/organisation";
import { ConfigProvider } from "@aevatar-react-sdk/ui-react";
import { useAtom } from "jotai";
import { useCallback } from "react";

const useSetCurrentProject = () => {
  const [, setCurProjectId] = useAtom(CURRENT_PROJECT_ATOM);
  return useCallback(
    (projectId: string, domainName: string) => {
      setCurProjectId(projectId);
      // set sdk config
      domainName &&
        ConfigProvider.setConfig({
          requestDefaults: {
            baseURL: `${getDomainBaseUrl()}/${domainName}-client`,
          },
        });
    },
    [setCurProjectId],
  );
};

export default useSetCurrentProject;
