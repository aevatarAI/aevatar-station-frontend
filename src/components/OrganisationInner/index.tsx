import General, { type IGeneralInstance } from "@/components/General";
import OrganisationMember from "@/components/OrganisationMember";
import OrganisationProjects from "@/components/OrganisationProjects";
import OrganisationRole from "@/components/OrganisationRole";
import type { TAB_LIST } from "@/constants/sideBar";
import { useGeneral } from "@/hooks/useGeneral";
import { useOrgPermissions } from "@/hooks/useOrgPermissions";
import { useEffect, useRef } from "react";
interface IOrganisationInnerProps {
  tab: (typeof TAB_LIST)[number];
}

export default function OrganisationInner({ tab }: IOrganisationInnerProps) {
  const { handleUpdateName, currentOrg } = useGeneral();
  const userPermissions = useOrgPermissions();
  const generalRef = useRef<IGeneralInstance>(null);

  useEffect(() => {
    generalRef.current?.updateInput(currentOrg?.displayName ?? "");
  }, [currentOrg?.displayName]);

  return (
    <div>
      {tab === "general" && (
        <General
          ref={generalRef}
          header="Organisation Settings"
          title="Organisation Name"
          readonly={!userPermissions?.organizationsEdit}
          inputPlaceholder={currentOrg?.displayName ?? "Name"}
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
