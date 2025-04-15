import axios from 'axios';
import { QueryProps, Notification } from "@/hooks/useGetNotifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from '@/api';
import { navigate } from 'wouter/use-browser-location';

interface UpdateNotificationProps {
    id: string;
    status: number;
}

const updateNotification = (body: UpdateNotificationProps) => {
    return request.notifications.updateNotification({ data: body })
}

export const useUpdateNotification = (query: QueryProps) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['updateNotification', query],
        mutationFn: updateNotification,
        onMutate: async ({id, status}: UpdateNotificationProps) => {
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

export const useUpdateJoinNotifications = () => {
    return useMutation({
        mutationKey: ['join'],
        mutationFn: updateNotification,
        onError: () => {
            console.error("There was an issue updating join notifications")
        }
    })
}