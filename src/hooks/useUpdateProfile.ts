import { request } from "@/api";
import { USER_PROFILE_ATOM } from "@/state/atoms/profile";
import { useAtom } from "jotai";
import { useCallback } from "react";

export const useUpdateProfile = () => {
  const [, setProfile] = useAtom(USER_PROFILE_ATOM);

  return useCallback(async () => {
    const result = await request.profile.getProfile();
    setProfile(result.data);
  }, [setProfile]);
};
