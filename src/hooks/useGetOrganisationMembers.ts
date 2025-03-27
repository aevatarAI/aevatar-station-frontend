import { getOrganizationMembers } from "@/api/utils/organization";
import { CURRENT_ORGANIZATION_ATOM } from "@/state/atoms/organisation";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";

export const useGetOrganizationMembers = () => {
  const [organizationId] = useAtom(CURRENT_ORGANIZATION_ATOM);

  return useQuery({
    queryKey: ["organisationMembers", { organizationId }],
    queryFn: () => getOrganizationMembers(organizationId || ""),
    staleTime: 5000,
    enabled: !!organizationId,
  });
};
