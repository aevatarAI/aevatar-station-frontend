import { service } from "@/api/axios";
import { useNavigate } from "@/hooks/navigate";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { CLIENT_ID, GITHUB, SCOPE } from "@/services/auth";
import { accessTokenAtom, refreshTokenAtom } from "@/state/atoms";
import { IUserLoginType, USER_LOGIN_TYPE } from "@/state/atoms/profile";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";

export const useGetCallbackCode = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code") as string;

  return { code };
};

const useGetAuthServerAccessToken = () => {
  return useMutation({
    mutationKey: ["auth_access_token"],
    mutationFn: async (code: string) => {
      try {
        const response = await axios.post(
          "/connect/token",
          {
            grant_type: GITHUB,
            scope: SCOPE,
            client_id: CLIENT_ID,
            code,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );
        console.log("4 response", response);
        return response.data;
      } catch (_) {
        console.log("4.5 error", _);
        throw new Error("unable to fetch access token from auth server");
      }
    },
    retry: false,
  });
};

export const GithubLoginCallback = () => {
  const navigate = useNavigate();
  const loginAttemptedRef = useRef(false);
  const [, setLoginType] = useAtom(USER_LOGIN_TYPE);
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const [, setRefreshToken] = useAtom(refreshTokenAtom);
  const { mutateAsync } = useGetAuthServerAccessToken();
  const { code } = useGetCallbackCode();
  const getUserProfile = useUpdateProfile();

  useEffect(() => {
    const githubLogin = async () => {
      if (!code) {
        return navigate("/login");
      }

      if (loginAttemptedRef.current) {
        return;
      }

      loginAttemptedRef.current = true;

      try {
        const data = await mutateAsync(code);

        if (!data?.access_token) {
          throw new Error("unable to obtain access_token");
        }
        const accessToken = `${data.token_type} ${data.access_token}`;
        service.defaults.headers.Authorization = accessToken;
        setAccessToken(`Bearer ${data.access_token}`);
        setRefreshToken(data.refresh_token);
        setLoginType(IUserLoginType.SOCIAL_MEDIA);

        await getUserProfile();

        navigate("/redirect");
      } catch (_) {
        navigate("/error");
      }
    };

    if (!code && !loginAttemptedRef.current) {
      loginAttemptedRef.current = true;
      navigate("/login");
    }

    if (code && !loginAttemptedRef.current) {
      githubLogin();
    }
  }, [
    code,
    mutateAsync,
    navigate,
    setAccessToken,
    setRefreshToken,
    getUserProfile,
    setLoginType,
  ]);
  return null;
};
