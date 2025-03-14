import { getProjectPermissions } from "@/api/utils/project";
import { useToast } from "@/hooks/use-toast";
import { CURRENT_PROJECT_ATOM } from "@/state/atoms/organisation";
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

export const useProjectPermissions = () => {
  const [projectId] = useAtom(CURRENT_PROJECT_ATOM);
  const { toast } = useToast();

  const [permissions, setUserPermissions] = useAtom(PROJECT_PERMISSION_ATOM);

  const getUserPermissions = useCallback(async () => {
    try {
      if (!projectId) return;
      const result = await getProjectPermissions(projectId);

      setUserPermissions(result);
    } catch (error) {
      toast({
        description: handleErrorMessage(error),
      });
    }
  }, [projectId, toast, setUserPermissions]);

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
