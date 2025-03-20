import { request } from "@/api";
import General, { type IGeneralInstance } from "@/components/General";
import OrganisationMember from "@/components/OrganisationMember";
import OrganisationProjects from "@/components/OrganisationProjects";
import OrganisationRole from "@/components/OrganisationRole";
import type { TAB_LIST } from "@/constants/sideBar";
import { useToast } from "@/hooks/use-toast";
import { useUpdateOrganisationsHandler } from "@/hooks/useUpdateOrganisations";
import {
  CURRENT_ORGANIZATION_ATOM,
  ORGANIZATIONS_LIST_ATOM,
} from "@/state/atoms/organisation";
import { handleErrorMessage } from "@etransfer/utils";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef } from "react";

interface IOrganisationInnerProps {
  tab: (typeof TAB_LIST)[number];
}

export default function OrganisationInner({ tab }: IOrganisationInnerProps) {
  const { toast } = useToast();
  const [orgId] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const updateOrganizationList = useUpdateOrganisationsHandler();
  const [orgList] = useAtom(ORGANIZATIONS_LIST_ATOM);

  const onNameSave = useCallback(
    async (displayName: string) => {
      try {
        if (!orgId) return;
        await request.organizations.editOrganization({
          query: orgId,
          data: {
            displayName,
          },
        });
        toast({
          description: "Successfully",
        });
        updateOrganizationList();
      } catch (error) {
        toast({
          description: handleErrorMessage(error, "Error: save name"),
        });
      }
    },
    [toast, orgId, updateOrganizationList]
  );
  const curOrg = useMemo(
    () => orgList.find((item) => item.id === orgId),
    [orgId, orgList]
  );

  const generalRef = useRef<IGeneralInstance>();

  useEffect(() => {
    generalRef.current?.updateInput(curOrg?.displayName ?? "");
  }, [curOrg?.displayName]);

  return (
    <div>
      {tab === "general" && (
        <General
          ref={generalRef}
          header="organisation settings"
          title={"organisation name"}
          inputPlaceholder={curOrg?.displayName ?? "name"}
          defaultValue={curOrg?.displayName}
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
