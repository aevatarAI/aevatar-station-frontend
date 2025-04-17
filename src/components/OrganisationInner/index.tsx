import General from "@/components/General";
import OrganisationMember from "@/components/OrganisationMember";
import OrganisationProjects from "@/components/OrganisationProjects";
import OrganisationRole from "@/components/OrganisationRole";
import { useGeneral } from "@/hooks/useGeneral";
import type { TAB_LIST } from "@/constants/sideBar";
interface IOrganisationInnerProps {
  tab: (typeof TAB_LIST)[number];
}

export default function OrganisationInner({ tab }: IOrganisationInnerProps) {
  const { handleUpdateName, currentOrg } = useGeneral();

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
