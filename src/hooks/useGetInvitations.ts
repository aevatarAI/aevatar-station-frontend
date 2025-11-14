import type { Invite } from "@/hooks/useGetOrganisationInvites";
import { deduplicate, reverse } from "@/utils/helpers";
import { useEffect, useMemo, useState } from "react";

export const useGetInvitations = (invitations: Invite[]) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  // [TODO] Remove after backend sorts
  const invites = useMemo(() => {
    const reversed = reverse(invitations || []);

    return deduplicate(reversed, "organizationId");
  }, [invitations]);
  const hasInvites = invites.length > 0;

  useEffect(() => {
    if (invites) {
      const ids = invites.map((invite) => invite.id);
      setSelectedValues(ids);
    }
  }, [invites]);

  return { invites, hasInvites, selectedValues, setSelectedValues };
};
