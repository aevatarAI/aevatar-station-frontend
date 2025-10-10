import { request } from "@/api";
import { useEmail } from "@/hooks/useEmail";
import { useQuery } from "@tanstack/react-query";

export interface Invite {
  id: string;
  organizationId: string;
  organizationName: string;
}

export const useGetOrganisationInvites = () => {
  const email = useEmail();
  return useQuery({
    queryKey: ["organisationInvites", { email }],
    queryFn: () =>
      request.notifications.getInvites({
        params: {
          pageIndex: 0,
          pageSize: 100,
        },
      }),
    enabled: !!email,
  });
};

export const getOrganisationInvites = async (): Promise<Invite[]> => {
  const result = await request.notifications.getInvites({
    params: {
      pageIndex: 0,
      pageSize: 100,
    },
  });
  return result.data;
};
