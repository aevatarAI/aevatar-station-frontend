import { service } from "@/api/axios";
import { getDomainBaseUrl } from "@/api/list";
import { accessTokenAtom } from "@/state/atoms";
import myEvents from "@/utils/myEvent";
import { ConfigProvider, aevatarAI } from "@aevatar-react-sdk/ui-react";
import { useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { useCurrentProject } from "./useCurrentProject";

export const useAevatarConfig = () => {
  const curProject = useCurrentProject();

  useEffect(() => {
    ConfigProvider.setConfig({
      requestDefaults: {
        // TODO: need to change to the new domain name
        // baseURL: `${getDomainBaseUrl()}/developer-client`,

        baseURL: `${getDomainBaseUrl()}/${curProject?.domainName}-client`,
      },
    });
  }, [curProject?.domainName]);

  const [accessToken] = useAtom(accessTokenAtom);
  useEffect(() => {
    aevatarAI.fetchRequest.setHeaders({
      // authorization: sdkToken,
      Authorization: accessToken || "",
    });
  }, [accessToken]);

  const tokenPendingRef = useRef(false);
  const getAuthToken = useCallback(async () => {
    if (!tokenPendingRef.current) {
      tokenPendingRef.current = true;
      myEvents.AuthorizationExpired.emit();
    }

    const token: string = await new Promise((resolve) => {
      const { remove } = myEvents.AuthorizationUpdated.addListener(
        (data: { error?: any; token?: string }) => {
          if (data.token) resolve(data.token);
          remove();
        },
      );
    });
    tokenPendingRef.current = false;
    service.defaults.headers.Authorization = token;

    return (service.defaults.headers.Authorization as string) || "";
  }, []);

  useEffect(() => {
    ConfigProvider.setConfig({
      getAevatarAuthToken: getAuthToken,
    });
  }, [getAuthToken]);
};
