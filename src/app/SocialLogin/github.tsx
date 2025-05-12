import { useNavigate } from "@/hooks/navigate";
import { useJWTDecode } from "@/hooks/useEmail";
import { CLIENT_ID, GITHUB, SCOPE } from "@/services/auth";
import { accessTokenAtom, refreshTokenAtom } from "@/state/atoms";
import {
  IUserLoginType,
  USER_LOGIN_TYPE,
  USER_PROFILE_ATOM,
} from "@/state/atoms/profile";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";

export const useGetCallbackCode = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code") as string;
  console.log({ code, searchParams });

  return { code };
};

const useGetAuthServerAccessToken = () => {
  return useMutation({
    mutationKey: ["auth_access_token"],
    mutationFn: async (code: string) => {
      try {
        const response = await axios.post(
          "https://aevatar-station-ui-staging.aevatar.ai/pre-auth/connect/token",
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
          }
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
  const [, setProfile] = useAtom(USER_PROFILE_ATOM);
  const [, setLoginType] = useAtom(USER_LOGIN_TYPE);
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const [, setRefreshToken] = useAtom(refreshTokenAtom);
  const { mutateAsync } = useGetAuthServerAccessToken();
  const { code } = useGetCallbackCode();
  const { decodeJwt } = useJWTDecode();

  useEffect(() => {
    const githubLogin = async () => {
      console.log("1", { code });
      if (!code) {
        console.log("navigate");
        return navigate("/login");
      }
      console.log("2");

      if (loginAttemptedRef.current) {
        console.log("2.5");
        return;
      }

      console.log("3");
      loginAttemptedRef.current = true;

      try {
        const data = await mutateAsync(code);
        console.log("5");

        if (!data?.access_token) {
          console.log("!5.5");
          throw new Error("unable to obtain access_token");
        }

        setAccessToken(`Bearer ${data.access_token}`);
        setRefreshToken(data.refresh_token);
        setLoginType(IUserLoginType.SOCIAL_MEDIA);

        const decodedProfile = decodeJwt(data.access_token);
        setProfile({
          ...decodedProfile,
          name: decodedProfile.preferred_username,
        });

        navigate("/redirect");
      } catch (_) {
        console.log("6", "error");
        navigate("/error");
      }
    };

    if (!code && !loginAttemptedRef.current) {
      console.log("redirect to login here");
      loginAttemptedRef.current = true;
      navigate("/login");
    }

    if (code && !loginAttemptedRef.current) {
      console.log("git hub login");
      githubLogin();
    }
  }, [
    code,
    mutateAsync,
    navigate,
    setAccessToken,
    setRefreshToken,
    setProfile,
    setLoginType,
    decodeJwt,
  ]);
};
