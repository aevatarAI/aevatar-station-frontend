import { accessTokenAtom } from "@/state/atoms";
import { useAtom } from "jotai";

export const useAccessTokenAtom = () => {
  const [accessToken] = useAtom(accessTokenAtom)
  const validAccessToken = typeof accessToken === 'string' ? accessToken : '';
  return validAccessToken
}