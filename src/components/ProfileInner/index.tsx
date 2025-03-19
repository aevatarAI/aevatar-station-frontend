import { request } from "@/api";
import General from "@/components/General";
import Notifications from "@/components/Notifications";
import type { TAB_LIST } from "@/constants/sideBar";
import { useToast } from "@/hooks/use-toast";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { USER_PROFILE_ATOM } from "@/state/atoms/profile";
import { handleErrorMessage, sleep } from "@etransfer/utils";
import { useAtom } from "jotai";
import { useCallback } from "react";

interface IProfileInnerProps {
  tab: (typeof TAB_LIST)[number];
}
export default function ProfileInner({ tab }: IProfileInnerProps) {
  const { toast } = useToast();
  const [profile] = useAtom(USER_PROFILE_ATOM);
  const getUserProfile = useUpdateProfile();

  const onNameSave = useCallback(
    async (userName: string) => {
      try {
        await request.profile.editProfile({
          data: {
            userName,
            email: profile?.email,
            name: profile?.name,
            surname: profile?.surname,
            phoneNumber: profile?.phoneNumber,
            concurrencyStamp: profile?.concurrencyStamp,
          },
        });
        toast({
          description: "Successfully",
        });
        getUserProfile();
      } catch (error) {
        toast({
          description: handleErrorMessage(error, "Error: save name"),
        });
      }
    },
    [toast, profile, getUserProfile]
  );
  return (
    <div>
      {tab === "general" && (
        <General
          header="profile"
          title={"name"}
          inputPlaceholder={profile?.userName ?? "name"}
          defaultValue={profile?.userName}
          buttonProps={{ placement: "top-right" }}
          onConfirm={onNameSave}
        />
      )}
      {tab === "notifications" && <Notifications />}
    </div>
  );
}
