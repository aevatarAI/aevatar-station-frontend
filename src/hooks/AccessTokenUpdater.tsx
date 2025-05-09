import { service } from "@/api/axios";
import { useNavigate } from "@/hooks/navigate";
import { useLogout } from "@/hooks/useLogout";
import { refreshTokenLogin } from "@/services/auth";
import { accessTokenAtom, refreshTokenAtom } from "@/state/atoms";
import myEvents from "@/utils/myEvent";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

export const useUpdateRefreshToken = () => {
  const [_, setAccessToken] = useAtom(accessTokenAtom);
  const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom);

  const updateAccessToken = useCallback(async () => {
    if (refreshToken) {
      try {
        const data = await refreshTokenLogin(refreshToken);
        const accessToken = `${data.token_type} ${data.access_token}`;
        service.defaults.headers.Authorization = accessToken;

        setAccessToken(accessToken);
        setRefreshToken(data.refresh_token);

        myEvents.AuthorizationUpdated.emit({
          token: accessToken,
          error: null,
        });
      } catch (error) {
        myEvents.AuthorizationUpdated.emit({ token: undefined, error });
      }
    }
  }, [refreshToken, setAccessToken, setRefreshToken]);

  return { updateAccessToken };
};

export const AccessTokenUpdater = () => {
  const logout = useLogout();
  const nav = useNavigate();
  const [_, setAccessToken] = useAtom(accessTokenAtom);
  const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom);

  const expiredHandler = useCallback(
    async (_text?: string) => {
      if (refreshToken) {
        try {
          const data = await refreshTokenLogin(refreshToken);
          const accessToken = `${data.token_type} ${data.access_token}`;
          service.defaults.headers.Authorization = accessToken;

          setAccessToken(accessToken);
          setRefreshToken(data.refresh_token);
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
