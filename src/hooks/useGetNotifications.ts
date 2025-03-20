import { useQuery } from '@tanstack/react-query';
import * as signalR from '@microsoft/signalr';
import { request } from "@/api";
export interface Notification {
  id: string;
  type: number;
  content: string;
  status: number;
  creatorId: string;
  createTime: string;
  receiver: string;
}

export interface QueryProps {
  pageIndex: number;
  pageSize: number;
}

const fetchNotifications = async (query: QueryProps) => {
  return request.notifications.getNotifications({params: {...query}});
}

export const useGetNotifications = ({ pageIndex, pageSize }: QueryProps) => {  
  return useQuery({
    queryKey: ['notifications', { pageIndex, pageSize }],
    queryFn: () => fetchNotifications({ pageIndex, pageSize }),
    refetchInterval: 1000 * 60 * 5,
    enabled: Number(pageIndex) >= 0 && Number(pageSize) >= 0
  })
}

const establishSignalR = async (token: string) => {
    try {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl('/api/notifications', {
          withCredentials: false,
          accessTokenFactory: () => {
            return token.replace(/^Bearer\s+/, '');
          }
        })
        .configureLogging(signalR.LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      const isConnected = await connection.start();
      return isConnected
    } catch (e) {
      throw new Error('Unable to connect to websocket server')
    }
}

export const useSignalR = (token: string) => {
  return useQuery({
    queryKey: ['signalR', { token }],
    queryFn: () => establishSignalR(token),
    staleTime: Infinity
  })
}
