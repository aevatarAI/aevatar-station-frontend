import type { IOrganizationItem } from "@/api/utils/organization";
import { useGetOrganizations } from "@/hooks/useGetOrganizations";
import { useUpdateOrganisationName } from "@/hooks/useUpdateOrganisationName";
import {
  CURRENT_ORGANIZATION_ATOM,
  ORGANIZATIONS_LIST_ATOM,
} from "@/state/atoms/organisation";
import { useAtom } from "jotai";

export const useGeneral = () => {
  const [orgId] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const [, setOrganizationsList] = useAtom(ORGANIZATIONS_LIST_ATOM);
  const { data, refetch } = useGetOrganizations();
  const { mutateAsync } = useUpdateOrganisationName();
  const handleUpdateName = async (displayName: string) => {
    await mutateAsync(displayName);
    const result = await refetch();
    const list = result.data?.data?.items;
    list && setOrganizationsList(list);
  };
  const currentOrg = data?.data?.items.find(
    (item: IOrganizationItem) => item.id === orgId,
  );

  return { handleUpdateName, currentOrg };
};
