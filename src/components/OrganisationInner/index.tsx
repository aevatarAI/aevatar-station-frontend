import { request } from "@/api";
import General from "@/components/General";
import OrganisationMember from "@/components/OrganisationMember";
import OrganisationProjects from "@/components/OrganisationProjects";
import OrganisationRole from "@/components/OrganisationRole";
import type { TAB_LIST } from "@/constants/sideBar";
import { useToast } from "@/hooks/use-toast";
import { handleErrorMessage, sleep } from "@etransfer/utils";
import { useCallback } from "react";

interface IOrganisationInnerProps {
  tab: (typeof TAB_LIST)[number];
}

export default function OrganisationInner({ tab }: IOrganisationInnerProps) {
  const { toast } = useToast();
  const onNameSave = useCallback(
    async (displayName: string) => {
      try {
        await sleep(2000);
        await request.organizations.editOrganization({
          data: {
            displayName,
          },
        });
        toast({
          description: "Successfully",
        });
      } catch (error) {
        toast({
          description: handleErrorMessage(error, "Error: save name"),
        });
      }
    },
    [toast]
  );
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
