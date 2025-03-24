import { request } from "@/api";
import General from "@/components/General";
import { Notifications } from "@/components/Notifications";
import type { TAB_LIST } from "@/constants/sideBar";
import { useToast } from "@/hooks/use-toast";
import {
  type QueryProps,
  useGetNotifications,
  useSignalR,
} from "@/hooks/useGetNotifications";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { accessTokenAtom } from "@/state/atoms";
import { USER_PROFILE_ATOM } from "@/state/atoms/profile";
import { handleErrorMessage } from "@/utils/error";
import { useAtom } from "jotai";
import { useCallback, useState } from "react";

const useAccessTokenAtom = () => {
  const [accessToken] = useAtom(accessTokenAtom);
  const validAccessToken = typeof accessToken === "string" ? accessToken : "";
  return validAccessToken;
};
interface IProfileInnerProps {
  tab: (typeof TAB_LIST)[number];
}
export default function ProfileInner({ tab }: IProfileInnerProps) {
  const accessToken = useAccessTokenAtom();
  const [query, setQuery] = useState<QueryProps>({ pageIndex: 0, pageSize: 3 });
  const { data, isLoading, isError } = useGetNotifications(query);
  useSignalR(accessToken);

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
    [toast, profile, getUserProfile],
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
      {tab === "notifications" && (
        <Notifications
          data={data}
          isLoading={isLoading}
          isError={isError}
          query={query}
          onQueryUpdate={setQuery}
        />
      )}
    </div>
  );
}
