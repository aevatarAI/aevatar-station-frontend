import { request } from "@/api";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_PROJECT_ATOM,
} from "@/state/atoms/organisation";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";

export const useGetAPIRequests = (
  startTime = 1740980355000,
  endTime = 1743658755000
) => {
  const [projectId] = useAtom(CURRENT_PROJECT_ATOM);
  const [organisationId] = useAtom(CURRENT_ORGANIZATION_ATOM);

  return useQuery({
    queryKey: ["api-requests", { projectId, organisationId }],
    queryFn: () => {
      return request.apiRequests.getAPIRequest({
        params: {
          OrganizationId: organisationId,
          ProjectId: projectId,
          StartTime: startTime,
          EndTime: endTime,
        },
      });
    },
  });
};
