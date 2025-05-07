import { useNavigate } from "@/hooks/navigate";
import { useJWTDecode } from "@/hooks/useEmail";
import { accessTokenAtom } from "@/state/atoms";
import {
  IUserLoginType,
  USER_LOGIN_TYPE,
  USER_PROFILE_ATOM,
} from "@/state/atoms/profile";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

const fetchGoogleUserprofile = async (access_token: string) => {
  const response = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};

const useGetGoogleUserProfile = (access_token: string) => {
  return useQuery({
    queryKey: ["user-profile", { access_token }],
    queryFn: () => fetchGoogleUserprofile(access_token),
    enabled: !!access_token,
  });
};

const useGetAuthServerAccessToken = () => {
  return useMutation({
    mutationKey: ["google_access_token"],
    mutationFn: async (id_token: string) => {
      try {
        const response = await axios.post(
          "/connect/token",
          {
            grant_type: "google",
            scope: "Aevatar offline_access",
            client_id: "AevatarAuthServer",
            id_token,
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

export const getURLParams = (hash: any) => {
  const params: { [key: string]: string } = {};
  const paramsArray = hash.slice(1).split("&");
  paramsArray.forEach((param: any) => {
    const [key, value] = param.split("=");
    params[key] = value;
  });
  return params;
};

export const GoogleLoginCallback = () => {
  const navigate = useNavigate();
  const [, setLoginType] = useAtom(USER_LOGIN_TYPE);
  const [, setProfile] = useAtom(USER_PROFILE_ATOM);
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const [googleAccessToken, setGoogleAccessToken] = useState("");
  const { mutateAsync } = useGetAuthServerAccessToken();
  const { data: userProfile } = useGetGoogleUserProfile(googleAccessToken);
  const { decodeJwt } = useJWTDecode();

  useEffect(() => {
    const googleLogin = async () => {
      const hash = window.location.hash;

      if (hash) {
        const params = getURLParams(hash);
        setGoogleAccessToken(params.access_token);

        await mutateAsync(params.id_token, {
          onSettled(data) {
            if (!data.access_token) {
              throw new Error("unable to obtain access_token");
            }
            setAccessToken(`Bearer ${data.access_token}`);
            setLoginType(IUserLoginType.SOCIAL_MEDIA);
            navigate("/redirect");
          },
          onError: () => {
            navigate("/error");
          },
        });
      }
    };

    googleLogin();
  }, [mutateAsync, navigate, setLoginType, setAccessToken]);

  useEffect(() => {
    if (userProfile) {
      setProfile(userProfile);
    }
  }, [userProfile, setProfile]);
};
