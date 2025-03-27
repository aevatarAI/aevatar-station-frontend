import { Notifications } from "@/components/Notifications";
import ProfileGeneral from "@/components/ProfileGeneral";
import type { TAB_LIST } from "@/constants/sideBar";
import {
  type QueryProps,
  useGetNotifications,
  useSignalR,
} from "@/hooks/useGetNotifications";

import { useCallback, useState } from "react";
interface IProfileInnerProps {
  tab: (typeof TAB_LIST)[number];
}
export default function ProfileInner({ tab }: IProfileInnerProps) {
  const [query, setQuery] = useState<QueryProps>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading, isError } = useGetNotifications(query);
  useSignalR();

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
