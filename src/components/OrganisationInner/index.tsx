import InviteMembersDialog from "@/components/AddMembersDialog";
import General from "@/components/General";
import OrganisationMember from "@/components/OrganisationMember";
import OrganisationProjects from "@/components/OrganisationProjects";
import OrganisationRole from "@/components/OrganisationRole";
import type { TAB_LIST } from "@/constants/sideBar";
import { sleep } from "@etransfer/utils";
import { useCallback } from "react";

interface IOrganisationInnerProps {
  tab: (typeof TAB_LIST)[number];
}

export default function OrganisationInner({ tab }: IOrganisationInnerProps) {
  const onNameSave = useCallback(async () => {
    await sleep(2000);
  }, []);
  return (
    <div>
      {tab === "general" && (
        <General
          header="organisation settings"
          title={"organisation name"}
          inputPlaceholder="name"
          buttonProps={{ placement: "bottom-left" }}
          onConfirm={onNameSave}
        />
      )}
      {tab === "project" && <OrganisationProjects />}
      {tab === "member" && <OrganisationMember />}
      {tab === "role" && <OrganisationRole />}
    </div>
  );
}
