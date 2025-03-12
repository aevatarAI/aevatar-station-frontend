import LoadingButton from "@/components/LoadingButton.tsx";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { handleErrorMessage, sleep } from "@etransfer/utils";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Notifications() {
  const [noticationList, setNoticationList] = useState<
    {
      id: string;
      timestamp: number | string;
      name: string;
      organisation: string;
      action: string;
      joined?: boolean;
    }[]
  >();
  useEffect(() => {
    setNoticationList([
      {
        timestamp: Date.now(),
        name: "username",
        organisation: "organisation name",
        action: "invite",
        id: "id1",
      },
      {
        timestamp: Date.now(),
        name: "username",
        organisation: "organisation name",
        action: "invite",
        joined: false,
        id: "id2",
      },
      {
        timestamp: Date.now(),
        name: "username",
        organisation: "organisation name",
        action: "invite",
        joined: true,
        id: "id3",
      },
    ]);
  }, []);

  const { toast } = useToast();

  const onJoin = useCallback(async () => {
    try {
      await sleep(1000);
      toast({
        title: "",
        description: "successfully joined",
      });
    } catch (error) {
      toast({
        title: "",
        description: handleErrorMessage(error, "something error"),
      });
    }
  }, [toast]);

  const onDecline = useCallback(async () => {
    try {
      await sleep(1000);
      toast({
        title: "",
        description: "successfully declined",
      });
    } catch (error) {
      toast({
        title: "",
        description: handleErrorMessage(error, "something error"),
      });
    }
  }, [toast]);

  return (
    <div>
      <div className="flex justify-between items-center pb-[20px] lg:pb-[30px] border-b border-[#303030]">
        <div className="font-syne text-[18px] font-semibold lowercase aevatarai-text-gradient">
          Notifications
        </div>
      </div>
      <div className="pt-[30px]">
        {noticationList?.map((item) => (
          <div
            className="flex flex-col lg:flex-row lg:justify-between mb-[40px]"
            key={item.id}>
            <div className="mb-[15px] lg:mb-0">
              <div className="text-[#B9B9B9] font-source-code text-[12px] font-normal leading-normal lowercase mb-[10px]">
                {dayjs(item.timestamp).format("DD/MM/YYYY HH:mm")}
              </div>
              <div className="text-[#B9B9B9] font-syne text-[15px] font-semibold leading-normal">
                <span className="text-white">{`${item.name} `}</span>
                <span>has invited you to join</span>
                <span className="text-white">{` ${item.organisation}`}</span>
              </div>
            </div>
            <div className="flex gap-[12px] items-center">
              <LoadingButton
                className="py-[7px] px-[17px] leading-[14px] text-[12px]"
                onClick={onJoin}>
                join
              </LoadingButton>
              <LoadingButton
                className="py-[7px]  px-[17px]  leading-[14px] text-[12px]"
                onClick={onDecline}>
                decline
              </LoadingButton>
              <Button
                className="py-[7px]  px-[17px]  leading-[14px] text-[12px]"
                disabled>
                joined
              </Button>
              <Button
                className="py-[7px]  px-[17px]  leading-[14px] text-[12px]"
                disabled>
                rejected
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
