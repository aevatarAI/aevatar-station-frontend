import { service } from "@/api/axios";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { login } from "@/services/auth";
import { accessTokenAtom } from "@/state/atoms";
import { useAtom } from "jotai";
import { useToast } from "@/hooks/use-toast";

export const useLogin = () => {
  const { toast } = useToast();
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
      toast({ description: "Unable to login" });
      return false;
    }
  };

  return { loginUser };
};
