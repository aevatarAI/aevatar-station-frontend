import { accessTokenAtom } from "@/state/atoms";
import { useAtom } from "jotai";

export const useAccessTokenAtom = () => {
  const [accessToken] = useAtom(accessTokenAtom) || localStorage.getItem("access_token");
  const validAccessToken = typeof accessToken === 'string' ? accessToken : '';
  return validAccessToken
}