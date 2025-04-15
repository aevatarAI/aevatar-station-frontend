import { request } from "@/api";
import { useEmail } from "@/hooks/useEmail"
import { UNREAD_NOTIFICATION_ATOM } from "@/state/atoms/notification";
import { useMutation } from "@tanstack/react-query"
import { useAtom } from "jotai";

export const usePostReadNotifications = () => {
    const email = useEmail();
    const [, setUnreadNotifications] = useAtom(UNREAD_NOTIFICATION_ATOM);

    return useMutation({
        mutationKey: ["read-notifications", { email }],
        mutationFn: () => {
            setUnreadNotifications(false);
            return request.notifications.postReadNotifications({ data: {} });
        },
    })
}