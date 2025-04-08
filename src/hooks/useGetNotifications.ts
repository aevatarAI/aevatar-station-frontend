import { useQuery } from '@tanstack/react-query';
import * as signalR from '@microsoft/signalr';
import { request } from "@/api";
import { useAccessTokenAtom } from '@/hooks/useAccessToken';
import { SIGNAL_R_URL } from '@/config';
export interface Notification {
  id: string;
  type: number;
  content: string;
  status: number;
  creatorId: string;
  creationTime: string;
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
    refetchInterval: 1000 * 30,
    enabled: Number(pageIndex) >= 0 && Number(pageSize) >= 0
  })
}

const establishSignalR = async (token: string) => {
    try {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(SIGNAL_R_URL, {
          withCredentials: false,
          accessTokenFactory: () => {
            return token.replace(/^Bearer\s+/, '');
          }
        })
        .configureLogging(signalR.LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      await connection.start();

    } catch (e) {
      throw new Error("Unable to establish SignalR connection")
    }
}

export const useSignalR = () => {
  const token = useAccessTokenAtom();

  return useQuery({
    queryKey: ['signalR', { token }],
    queryFn: () => establishSignalR(token),
  })
}
