import { request } from "@/api";
import { useAccessTokenAtom } from "@/hooks/useAccessToken";
import * as signalR from "@microsoft/signalr";
import { useQuery } from "@tanstack/react-query";
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
  return request.notifications.getNotifications({ params: { ...query } });
};

export const useGetNotifications = ({ pageIndex, pageSize }: QueryProps) => {
  return useQuery({
    queryKey: ["notifications", { pageIndex, pageSize }],
    queryFn: () => fetchNotifications({ pageIndex, pageSize }),
    refetchInterval: 5000,
    enabled: Number(pageIndex) >= 0 && Number(pageSize) >= 0,
  });
};

const establishSignalR = async (token: string) => {
  try {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("/api/notifications", {
        withCredentials: false,
        accessTokenFactory: () => {
          return token.replace(/^Bearer\s+/, "");
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    await connection.start();
    return true;
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  } catch (e: any) {
    throw new Error("Unable to establish SignalR connection");
  }
};

export const useSignalR = () => {
  const token = useAccessTokenAtom();

  return useQuery({
    queryKey: ["signalR", { token }],
    queryFn: () => establishSignalR(token),
    staleTime: Number.POSITIVE_INFINITY,
  });
};
