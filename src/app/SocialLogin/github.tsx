import { useNavigate } from "@/hooks/navigate";
import { useJWTDecode } from "@/hooks/useEmail";
import { CLIENT_ID, GITHUB, SCOPE } from "@/services/auth";
import { accessTokenAtom } from "@/state/atoms";
import {
  IUserLoginType,
  USER_LOGIN_TYPE,
  USER_PROFILE_ATOM,
} from "@/state/atoms/profile";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";

export const useGetCallbackCode = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code") as string;

  return { code };
};

export const useGetGithubAccessToken = () => {
  return useMutation({
    mutationKey: ["github_access_token"],
    mutationFn: async (code: string) => {
      try {
        const response = await axios.post(
          `https://github.com/login/oauth/access_token?client_id=${
            import.meta.env.VITE_GITHUB_CLIENT_ID
          }&client_secret=${
            import.meta.env.VITE_GITHUB_CLIENT_SECRET
          }&code=${code}`
        );
        console.log("1", response);
        return response;
      } catch (_) {
        throw new Error("unable to fetch access token from github");
      }
    },
    retry: false,
  });
};

// const useGetAuthServerAccessToken = () => {
//   return useMutation({
//     mutationKey: ["auth_access_token"],
//     mutationFn: async (code: string) => {
//       try {
//         const response = await axios.post(
//           "https://aevatar-station-ui-staging.aevatar.ai/pre-auth/connect/token",
//           {
//             grant_type: GITHUB,
//             scope: SCOPE,
//             client_id: CLIENT_ID,
//             code,
//           },
//           {
//             headers: {
//               "Content-Type": "application/x-www-form-urlencoded",
//             },
//           }
//         );

//         return response.data;
//       } catch (_) {
//         throw new Error("unable to fetch access token from auth server");
//       }
//     },
//     retry: false,
//   });
// };

export const GithubLoginCallback = () => {
  const navigate = useNavigate();
  const loginAttemptedRef = useRef(false);
  const [, setProfile] = useAtom(USER_PROFILE_ATOM);
  const [, setLoginType] = useAtom(USER_LOGIN_TYPE);
  const [, setAccessToken] = useAtom(accessTokenAtom);
  // const { mutateAsync } = useGetAuthServerAccessToken();
  const { mutateAsync } = useGetGithubAccessToken();
  const { code } = useGetCallbackCode();
  const { decodeJwt } = useJWTDecode();

  useEffect(() => {
    const githubLogin = async () => {
      if (loginAttemptedRef.current) {
        return;
      }

      loginAttemptedRef.current = true;

      try {
        // const data = await mutateAsync(code);
        const data = await mutateAsync(code);
        console.log("2", data);

        // if (!data?.access_token) {
        //   throw new Error("unable to obtain access_token");
        // }

        // setAccessToken(`Bearer ${data.access_token}`);
        // setLoginType(IUserLoginType.SOCIAL_MEDIA);

        // const decodedProfile = decodeJwt(data.access_token);
        // setProfile({
        //   ...decodedProfile,
        //   name: decodedProfile.preferred_username,
        // });

        navigate("/redirect");
      } catch (_) {
        navigate("/error");
      }
    };

    if (code && !loginAttemptedRef.current) {
      githubLogin();
    }
  }, [code, mutateAsync, navigate, setAccessToken, setProfile, setLoginType]);
};
