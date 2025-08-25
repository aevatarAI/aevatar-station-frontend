import { deduplicate, reverse } from "@/utils/helpers";
import { useEffect, useMemo, useState } from "react";

export const useGetInvitations = (invitations: any) => {
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    // [TODO] Remove after backend sorts  
    const invites = useMemo(() => {
      const reversed = reverse(invitations?.data || []);
      return deduplicate(reversed, "organizationId");
    }, [invitations?.data]);
    const hasInvites = invites.length > 0;
  
    useEffect(() => {
      if (invites) {
        const ids = invites.map(invite => invite.id);
        setSelectedValues(ids);
      }
    }, [invites])

    return { invites, hasInvites, selectedValues, setSelectedValues }
}
