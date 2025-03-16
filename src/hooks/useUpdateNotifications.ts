import { NOTIFIED } from "@/constants";
import { Notification } from "@/hooks/useGetNotifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateNotification = async ({notificationId, status }: {notificationId: string, status: string}) => {
    return await fetch('/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: notificationId,
          status
        })
      })
}

export const useUpdateNotification = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['updateNotification'],
        mutationFn: updateNotification,
        onMutate: async ({notificationId, status}: {notificationId: string, status: string}) => {
            await queryClient.cancelQueries({ queryKey: ['notifications'] })

            const previousNotifications = queryClient.getQueryData<Notification[]>(['notifications'])

            queryClient.setQueryData(['notifications'], (old: Notification[]) => {
                const index = old.findIndex(item => item.id === notificationId);
                const notification = {
                    ...old[index],
                    type: NOTIFIED,
                    status
                }
                const results = [
                    ...old.slice(0, index),
                    notification,
                    ...old.slice(index + 1)
                ]
                return results
            })

            return { previousNotifications }
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(['notifications'], context?.previousNotifications)   
        },
        onSettled: () => {
            /** 
             * [TODO] - Once backend is set up, uncomment this
             * queryClient.invalidateQueries({ queryKey: ['notifications'] })
             * 
            */
        }
    })
}