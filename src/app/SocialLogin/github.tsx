import { CLIENT_ID, GITHUB, LOGIN_URL, SCOPE } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import qs from "qs";
import axios from "axios";
import { useNavigate } from "@/hooks/navigate";
import { useSetAtom } from "jotai";
import { socialMediaLoginAtom } from "@/state/atoms";

export const useGithubLogin = () => {
  const setSocialMediaLogin = useSetAtom(socialMediaLoginAtom);

  return useMutation({
    mutationKey: ["github-login"],
    mutationFn: (code: string) => {
      setSocialMediaLogin(true);

      const options = {
        method: "POST",
        url: LOGIN_URL,
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify({
          grant_type: GITHUB,
          scope: SCOPE,
          client_id: CLIENT_ID,
          code,
        }),
      };

      return axios(options);
    },
  });
};

export const useGetCallbackCode = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code") as string;

  return { code };
};

export const GithubLogin = () => {
  const navigate = useNavigate();
  const { mutateAsync, isError, error } = useGithubLogin();
  const { code } = useGetCallbackCode();

  useEffect(() => {
    const githubLogin = async () => {
      await mutateAsync(code, {
        onSuccess: () => {
          navigate("/redirect");
        },
      });
    };

    githubLogin();
  }, []);

  return isError ? (
    <span className="text-red-400">Error logging in using Github</span>
  ) : null;
};
