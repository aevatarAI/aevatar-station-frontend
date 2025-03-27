import { request } from "@/api";
import { useEmail } from "@/hooks/useEmail";
import { useQuery } from "@tanstack/react-query";

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
