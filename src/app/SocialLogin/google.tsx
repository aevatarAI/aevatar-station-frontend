import { service } from "@/api/axios";
import { useNavigate } from "@/hooks/navigate";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { LOGIN_URL } from "@/services/auth";
import { accessTokenAtom, refreshTokenAtom } from "@/state/atoms";
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
  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    console.log("response", response);
    return response.data;
  } catch (e) {
    console.log("error in fetching google profile", e);
  }
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
          LOGIN_URL,
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
          },
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
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const [, setRefreshToken] = useAtom(refreshTokenAtom);
  const [googleAccessToken, setGoogleAccessToken] = useState("");
  const { mutateAsync } = useGetAuthServerAccessToken();
  const { data: userProfile } = useGetGoogleUserProfile(googleAccessToken);
  console.log("0. data", userProfile);
  const getUserProfile = useUpdateProfile();

  useEffect(() => {
    const googleLogin = async () => {
      const hash = window.location.hash;
      console.log("2 user profile", userProfile);

      if (hash) {
        const params = getURLParams(hash);
        setGoogleAccessToken(params.access_token);
        console.log("3 user profile", userProfile);

        await mutateAsync(params.id_token, {
          async onSettled(data) {
            if (!data.access_token) {
              throw new Error("unable to obtain access_token");
            }
            console.log("4 user profile", userProfile);
            const accessToken = `${data.token_type} ${data.access_token}`;
            service.defaults.headers.Authorization = accessToken;
            setAccessToken(`Bearer ${data.access_token}`);
            setRefreshToken(data.refresh_token);
            await getUserProfile();
            setLoginType(IUserLoginType.SOCIAL_MEDIA);
            navigate("/redirect");
          },
          onError: () => {
            console.log("5 user profile", userProfile);
            navigate("/error");
          },
        });
      }
    };

    googleLogin();
  }, [
    userProfile,
    setRefreshToken,
    mutateAsync,
    navigate,
    setLoginType,
    setAccessToken,
    getUserProfile,
  ]);

  return null;
};
