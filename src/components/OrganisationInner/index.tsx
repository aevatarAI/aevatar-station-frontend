import General from "@/components/General";
import OrganisationMember from "@/components/OrganisationMember";
import OrganisationProjects from "@/components/OrganisationProjects";
import OrganisationRole from "@/components/OrganisationRole";
import type { TAB_LIST } from "@/constants/sideBar";
import { useGetOrganizations } from "@/hooks/useGetOrganizations";
import { useUpdateOrganisationName } from "@/hooks/useUpdateOrganisationName";
import type { IOrganizationItem } from "@/api/utils/organization";
import { CURRENT_ORGANIZATION_ATOM } from "@/state/atoms/organisation";
import { useAtom } from "jotai";
interface IOrganisationInnerProps {
  tab: (typeof TAB_LIST)[number];
}

export default function OrganisationInner({ tab }: IOrganisationInnerProps) {
  const [orgId] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const { data, refetch } = useGetOrganizations();
  const { mutateAsync } = useUpdateOrganisationName();
  const handleUpdateName = async (displayName: string) => {
    await mutateAsync(displayName);
    refetch();
  };
  const currentOrg = data?.data?.items.find(
    (item: IOrganizationItem) => item.id === orgId
  );

  return (
    <div>
      {tab === "general" && (
        <General
          header="organisation settings"
          title="organisation name"
          inputPlaceholder={currentOrg?.displayName ?? "name"}
          defaultValue={currentOrg?.displayName ?? ""}
          buttonProps={{ placement: "bottom-left" }}
          onConfirm={handleUpdateName}
        />
      )}
      {tab === "project" && <OrganisationProjects />}
      {tab === "member" && <OrganisationMember />}
      {tab === "role" && <OrganisationRole />}
    </div>
  );
}
