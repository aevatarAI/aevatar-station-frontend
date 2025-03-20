import axios from 'axios';
import { QueryProps, Notification } from "@/hooks/useGetNotifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from '@/api';

interface UpdateNotificationProps {
    id: string;
    status: number;
}

const updateNotification = (body: UpdateNotificationProps) => {
    const data = JSON.stringify(body)
    return request.notifications.updateNotification({ data })
}

interface MutationProps {
    id: string;
    status: number;
}

export const useUpdateNotification = (query: QueryProps) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['updateNotification', query],
        mutationFn: updateNotification,
        onMutate: async ({id, status}: MutationProps) => {
            try {
                await queryClient.cancelQueries({ queryKey: ['notifications', query] })
        
                queryClient.setQueryData(['notifications', query], (old: { data: Notification[] }) => {
                    const index = old.data.findIndex(item => item.id === id);

                    const notification = {
                        ...old.data[index],
                        status
                    }
    
                    const data = [
                        ...old.data.slice(0, index),
                        notification,
                        ...old.data.slice(index + 1)
                    ]

                    return { data }
                })

            } catch (e) {
                console.log('error', e)
                return { data: [] }
            }
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(['notifications', query], context?.data)   
        },
        onSettled: () => {
            /** 
             * [TODO] - To refetch and re-render the page
             * queryClient.invalidateQueries({ queryKey: ['notifications'] })
            */
        }
    })
}