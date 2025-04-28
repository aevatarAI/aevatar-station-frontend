import { request } from "@/api";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_PROJECT_ATOM,
} from "@/state/atoms/organisation";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";

interface DateRange {
  from: number;
  to: number;
}

export const useGetAPIRequests = (date: DateRange, hasPermission: boolean) => {
  const [projectId] = useAtom(CURRENT_PROJECT_ATOM);
  const [organisationId] = useAtom(CURRENT_ORGANIZATION_ATOM);

  return useQuery({
    queryKey: ["api-requests", { projectId, organisationId, ...date }],
    queryFn: () => {
      // Might need to use useEffect here
      return request.apiRequests.getAPIRequest({
        params: {
          OrganizationId: organisationId,
          ProjectId: projectId,
          StartTime: date.from,
          EndTime: date.to,
        },
      });
    },
    enabled: !!(date.from && date.to) && hasPermission,
  });
};