import Loading from "@/components/Loading";
import LoadingButton from "@/components/LoadingButton.tsx";
import { Button } from "@/components/ui/button";
import { ACCEPTED, DECLINED, DEFAULT, EXPIRED, INVITED } from "@/constants";
import type { Notification, QueryProps } from "@/hooks/useGetNotifications";
import { useUpdateNotification } from "@/hooks/useUpdateNotifications";
import { truncate } from "@/utils/helpers";
import dayjs from "dayjs";
interface NotificationsProps {
  data?: { data: Notification[] };
  isLoading: boolean;
  isError: boolean;
  query: QueryProps;
  onQueryUpdate?: (query: QueryProps) => void;
}

export const Notifications = ({
  data,
  isLoading,
  isError,
  query,
}: NotificationsProps) => {
  const { mutate } = useUpdateNotification(query);

  const onJoin = async (id: string, status: number) => {
    mutate({ id, status });
  };

  const onDecline = async (id: string, status: number) => {
    mutate({ id, status });
  };

  if (isLoading) {
    return <Loading data-testid="loading-spinner" />;
  }

  if (isError) {
    return <div data-testid="error-message">error...</div>;
  }

  if (!data?.data?.length) {
    return <div data-testid="empty-notifications">No notifications</div>;
  }

  return (
    <div data-testid="notifications-container">
      <div className="flex justify-between items-center pb-[20px] lg:pb-[30px] border-b border-[#303030]">
        <div className="font-syne text-[18px] font-semibold lowercase aevatarai-text-gradient">
          Notifications
        </div>
      </div>
      <div className="pt-[30px]">
        {data?.data?.map((item) => (
          <div
            className="flex flex-col lg:flex-row lg:justify-between mb-[40px]"
            key={item.id}
            data-testid={`notification-item-${item.id}`}
          >
            <div className="mb-[15px] lg:mb-0">
              <div className="text-[#B9B9B9] font-source-code text-[12px] font-normal leading-normal lowercase mb-[10px]">
                {dayjs
                  .utc(item.creationTime)
                  .local()
                  .format("DD.MM.YYYY HH:mm")}
              </div>
              <div className="text-[#B9B9B9] font-syne text-[15px] font-semibold leading-normal">
                <span className="text-white">{`${item.creatorName} `}</span>
                <span>has invited you to join</span>
                <span className="text-white">{` ${truncate(
                  item.content,
                  "has invited you to join"
                )}`}</span>
              </div>
            </div>
            <div className="flex gap-[12px] items-center">
              {item.type === INVITED && item.status === DEFAULT && (
                <>
                  <LoadingButton
                    data-testid="join-button"
                    className="py-[7px] px-[17px] leading-[14px] text-[12px]"
                    onClick={() => onJoin(item.id, ACCEPTED)}
                  >
                    join
                  </LoadingButton>
                  <LoadingButton
                    data-testid="decline-button"
                    className="py-[7px]  px-[17px]  leading-[14px] text-[12px]"
                    onClick={() => onDecline(item.id, DECLINED)}
                  >
                    decline
                  </LoadingButton>
                </>
              )}
              {item.type === INVITED && item.status === EXPIRED && (
                <Button
                  data-testid="expired-button"
                  className="py-[7px] px-[17px] leading-[14px] text-[12px]"
                  disabled
                >
                  expired
                </Button>
              )}
              {item.type === INVITED && item.status === ACCEPTED && (
                <Button
                  data-testid="joined-button"
                  className="py-[7px]  px-[17px]  leading-[14px] text-[12px]"
                  disabled
                >
                  joined
                </Button>
              )}
              {item.type === INVITED && item.status === DECLINED && (
                <Button
                  data-testid="rejected-button"
                  className="py-[7px]  px-[17px]  leading-[14px] text-[12px]"
                  disabled
                >
                  rejected
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
