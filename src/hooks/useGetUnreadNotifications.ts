import { request } from "@/api";
import { useEmail } from "@/hooks/useEmail"
import { useQuery } from "@tanstack/react-query"

export const useGetUnreadNotifications = () => {
    const email = useEmail();

    return useQuery({
        queryKey: ["unread-notifications", { email }],
        queryFn: () => request.notifications.getUnreadNotifications(),
        refetchInterval: 5000,
        enabled: !!email,
    })
}