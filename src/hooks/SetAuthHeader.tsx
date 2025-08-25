import { service } from "@/api/axios";
import { accessTokenAtom } from "@/state/atoms";
import { useAtom } from "jotai";
import { useEffect } from "react";

export const SetAuthHeader = () => {
  const [accessToken] = useAtom(accessTokenAtom);
  useEffect(() => {
    const authenticated = accessToken || localStorage.getItem("access_token");

    if (!service.defaults.headers.Authorization)
      service.defaults.headers.Authorization = authenticated;
  }, [accessToken]);
  return null;
};
