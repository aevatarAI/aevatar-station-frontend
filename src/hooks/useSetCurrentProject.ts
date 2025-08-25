import { getDomainBaseUrl } from "@/api/list";
import { updateRecentUsed } from "@/api/utils/project";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_PROJECT_ATOM,
} from "@/state/atoms/organisation";
import { ConfigProvider } from "@aevatar-react-sdk/ui-react";
import { useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";

const useSetCurrentProject = () => {
  const [, setCurProjectId] = useAtom(CURRENT_PROJECT_ATOM);
  const [organizationId] = useAtom(CURRENT_ORGANIZATION_ATOM);

  const organizationIdRef = useRef(organizationId);
  useEffect(() => {
    organizationIdRef.current = organizationId;
  }, [organizationId]);

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

      updateRecentUsed({
        projectId,
        organizationId: organizationIdRef.current || "",
      }).catch((error) => {
        console.error("updateRecentUsed", error);
      });
    },
    [setCurProjectId],
  );
};

export default useSetCurrentProject;
