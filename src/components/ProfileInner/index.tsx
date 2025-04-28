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
    <div className="flex flex-col gap-[30px]">
      <div className="flex gap-[30px] border-b border-[#303030]">
        <div
          data-testid="general-tab"
          className={`pb-[20px] cursor-pointer ${
            tab === "general"
              ? "text-white border-b-2 border-white"
              : "text-[#B9B9B9]"
          }`}
          onClick={() => setQuery({ pageIndex: 0, pageSize: 10 })}
        >
          General
        </div>
        <div
          data-testid="notifications-tab"
          className={`pb-[20px] cursor-pointer ${
            tab === "notifications"
              ? "text-white border-b-2 border-white"
              : "text-[#B9B9B9]"
          }`}
          onClick={() => setQuery({ pageIndex: 0, pageSize: 10 })}
        >
          Notifications
        </div>
      </div>
      {tab === "general" && (
        <div data-testid="general-content">
          <ProfileGeneral />
        </div>
      )}
      {tab === "notifications" && (
        <div data-testid="notifications-content">
          <Notifications
            data={data}
            isLoading={isLoading}
            isError={isError}
            query={query}
            onQueryUpdate={setQuery}
          />
        </div>
      )}
    </div>
  );
}
