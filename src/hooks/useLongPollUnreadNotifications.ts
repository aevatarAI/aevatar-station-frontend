import { useGetUnreadNotifications } from "@/hooks/useGetUnreadNotifications";
import { UNREAD_NOTIFICATION_ATOM } from "@/state/atoms/notification";
import { useAtom } from "jotai";
import { useEffect } from "react";

// [TODO] - To switch to websockets once backend is done
export const useLongPollUnreadNotifications = () => {
    const { data, isLoading } = useGetUnreadNotifications();
    const [, setUnreadNotifications] = useAtom(UNREAD_NOTIFICATION_ATOM)
    
    useEffect(() => {
        if (data?.data > 0) {
          setUnreadNotifications(true);
    }
  }, [isLoading, data])
}

