import { service } from "@/api/axios";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { login } from "@/services/auth";
import { accessTokenAtom, refreshTokenAtom } from "@/state/atoms";
import { useAtom } from "jotai";

export const useLogin = () => {
  const [_, setAccessToken] = useAtom(accessTokenAtom);
  const [__, setRefreshToken] = useAtom(refreshTokenAtom);
  const getUserProfile = useUpdateProfile();

  const loginUser = async (username: string, password: string) => {
    try {
      const data = await login(username, password);
      const accessToken = `${data.token_type} ${data.access_token}`;
      service.defaults.headers.Authorization = accessToken;
      setAccessToken(accessToken);
      setRefreshToken(data.refresh_token);
      getUserProfile();
      return true;
    } catch (_) {
      return false;
    }
  };

  return { loginUser };
};
