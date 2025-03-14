import dayjs from "dayjs";
import LoadingButton from "@/components/LoadingButton.tsx";
import { Button } from "@/components/ui/button";
import { ACCEPTED, DECLINED, INVITED } from '@/constants';
import { useGetNotifications } from "@/hooks/useGetNotifications";
import { useUpdateNotification } from "@/hooks/useUpdateNotifications";

export const Notifications = () => {
  const { data } = useGetNotifications();
  const { mutate } = useUpdateNotification();

  const onJoin = (notificationId: string, status: string) => {
    mutate({notificationId, status});
  }

  const onDecline = (notificationId: string, status: string) => {
    mutate({notificationId, status});
  }

  return (
    <div>
      <div className="flex justify-between items-center pb-[20px] lg:pb-[30px] border-b border-[#303030]">
        <div className="font-syne text-[18px] font-semibold lowercase aevatarai-text-gradient">
          Notifications
        </div>
      </div>
      <div className="pt-[30px]">
        {data?.map((item) => (
          <div
            className="flex flex-col lg:flex-row lg:justify-between mb-[40px]"
            key={item.id}>
            <div className="mb-[15px] lg:mb-0">
              <div className="text-[#B9B9B9] font-source-code text-[12px] font-normal leading-normal lowercase mb-[10px]">
                {dayjs(item.creatTime).format('D.MM.YYYY')}
              </div>
              <div className="text-[#B9B9B9] font-syne text-[15px] font-semibold leading-normal">
                <span className="text-white">{`${item.creator} `}</span>
                <span>has invited you to join</span>
                <span className="text-white">{` ${item.content.organizeId}`}</span>
              </div>
            </div>
            <div className="flex gap-[12px] items-center">
              {item.type === INVITED && 
              <>
              <LoadingButton
                className="py-[7px] px-[17px] leading-[14px] text-[12px]"
                onClick={() => onJoin(item.id, ACCEPTED)}>
                join
              </LoadingButton>
              <LoadingButton
                className="py-[7px]  px-[17px]  leading-[14px] text-[12px]"
                onClick={() => onDecline(item.id, DECLINED)}>
                decline
              </LoadingButton>
              </>}
              {item.type !== INVITED && item.status === ACCEPTED && <Button
                className="py-[7px]  px-[17px]  leading-[14px] text-[12px]"
                disabled>
                joined
              </Button>}
              {item.type !== INVITED && item.status === DECLINED && <Button
                className="py-[7px]  px-[17px]  leading-[14px] text-[12px]"
                disabled>
                rejected
              </Button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
