import { Notifications } from "@/components/Notifications";
import ProfileGeneral from "@/components/ProfileGeneral";
import type { TAB_LIST } from "@/constants/sideBar";
import {
  type QueryProps,
  useGetNotifications,
  useSignalR,
} from "@/hooks/useGetNotifications";
import { accessTokenAtom } from "@/state/atoms";

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

  return (
    <div>
      {tab === "general" && <ProfileGeneral />}
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
