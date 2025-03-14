import { getOrganizationPermissions } from "@/api/utils/organization";
import { useToast } from "@/hooks/use-toast";
import { CURRENT_ORGANIZATION_ATOM } from "@/state/atoms/organisation";
import { PROJECT_PERMISSION_ATOM } from "@/state/atoms/permissions";
import { handleErrorMessage } from "@etransfer/utils";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";

type TUserPermissions = {
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
  memberAdd?: boolean;
  memberDelete?: boolean;
};

export const useUserPermissions = () => {
  const [organizationId] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const { toast } = useToast();

  const [permissions, setUserPermissions] = useAtom(PROJECT_PERMISSION_ATOM);

  const getUserPermissions = useCallback(async () => {
    try {
      if (!organizationId) return;
      const result = await getOrganizationPermissions(organizationId);

      setUserPermissions(result);
    } catch (error) {
      toast({
        description: handleErrorMessage(error),
      });
    }
  }, [organizationId, toast, setUserPermissions]);

  useEffect(() => {
    getUserPermissions();
  }, [getUserPermissions]);

  return useMemo(() => {
    const _permissions: TUserPermissions = {};
    permissions?.forEach((item) => {
      if (item.name === "create") _permissions.create = true;
      if (item.name === "edit") _permissions.edit = true;
      if (item.name === "delete") _permissions.delete = true;
      if (item.name === "memberAdd") _permissions.memberAdd = true;
      if (item.name === "memberDelete") _permissions.memberDelete = true;
    });
    return _permissions;
  }, [permissions]);
};
