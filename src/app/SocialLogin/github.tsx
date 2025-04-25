import { CLIENT_ID, GITHUB, SCOPE } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "@/hooks/navigate";
import { useAtom } from "jotai";
import { accessTokenAtom } from "@/state/atoms";
import { IUserLoginType, USER_LOGIN_TYPE } from "@/state/atoms/profile";

export const useGetCallbackCode = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code") as string;

  return { code };
};

const useGetAuthServerAccessToken = () => {
  return useMutation({
    mutationKey: ["github_access_token"],
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
          }
        );

        return response.data;
      } catch (_) {
        throw new Error("unable to fetch access token from auth server");
      }
    },
  });
};

export const GithubLoginCallback = () => {
  const navigate = useNavigate();
  const [, setLoginType] = useAtom(USER_LOGIN_TYPE);
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const { mutateAsync } = useGetAuthServerAccessToken();
  const { code } = useGetCallbackCode();

  useEffect(() => {
    const githubLogin = async () => {
      await mutateAsync(code, {
        onSettled(data) {
          if (!data?.access_token) {
            throw new Error("unable to obtain access_token");
          }
          setLoginType(IUserLoginType.SOCIAL_MEDIA);
          setAccessToken(`Bearer ${data.access_token}`);
          navigate("/redirect");
        },
        onError: () => {
          navigate("/error");
        },
      });
    };

    githubLogin();
  }, [code, mutateAsync, navigate, setAccessToken, setLoginType]);

  return null;
};
