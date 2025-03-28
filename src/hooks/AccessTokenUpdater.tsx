import { service } from "@/api/axios";
import { MAX_REQUEST } from "@/api/constants";
import { useNavigate } from "@/hooks/navigate";
import { useLogout } from "@/hooks/useLogout";
import { refreshTokenLogin } from "@/services/auth";
import { accessTokenAtom, refreshTokenAtom } from "@/state/atoms";
import myEvents from "@/utils/myEvent";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

export const AccessTokenUpdater = () => {
  const logout = useLogout();
  const nav = useNavigate();
  const [_, setAccessToken] = useAtom(accessTokenAtom);
  const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom);

  const expiredHandler = useCallback(
    async (text?: string) => {
      if (refreshToken) {
        try {
          const data = await refreshTokenLogin(refreshToken);
          const accessToken = `${data.token_type} ${data.access_token}`;
          service.defaults.headers.Authorization = accessToken;

          setAccessToken(accessToken);
          setRefreshToken(`${data.token_type} ${data.refresh_token}`);
          myEvents.AuthorizationUpdated.emit({
            token: accessToken,
            error: null,
          });
          return;
        } catch (error) {
          myEvents.AuthorizationUpdated.emit({ token: undefined, error });
        }
      }

      logout();
      nav("/login");
      return;
    },
    [logout, nav, refreshToken, setRefreshToken, setAccessToken],
  );

  useEffect(() => {
    const { remove } =
      myEvents.AuthorizationExpired.addListener(expiredHandler);
    return () => {
      remove();
    };
  }, [expiredHandler]);
  return null;
};
