import { service } from "@/api/axios";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { login } from "@/services/auth";
import { accessTokenAtom } from "@/state/atoms";
import { useAtom } from "jotai";

export const useLogin = () => {
  const [_, setAccessToken] = useAtom(accessTokenAtom);
  const getUserProfile = useUpdateProfile();

  const loginUser = async (username: string, password: string) => {
    try {
      const data = await login(username, password);
      const accessToken = `${data.token_type} ${data.access_token}`;
      service.defaults.headers.Authorization = accessToken;
      setAccessToken(accessToken);
      getUserProfile();
      return true;
    } catch (e) {
      return false;
    }
  };

  return { loginUser };
};
