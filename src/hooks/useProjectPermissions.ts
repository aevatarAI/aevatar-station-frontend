import { getProjectPermissions } from "@/api/utils/project";
import { useToast } from "@/hooks/use-toast";
import { CURRENT_PROJECT_ATOM } from "@/state/atoms/organisation";
import { PROJECT_PERMISSION_ATOM } from "@/state/atoms/permissions";
import { handleErrorMessage } from "@/utils/error";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";

type TUserPermissions = {
  projects?: boolean;
  projectsCreate?: boolean;
  projectsEdit?: boolean;
  projectsDelete?: boolean;
  projectsMembers?: boolean;
  projectsMembersManage?: boolean;
  apiKeys?: boolean;
  apiKeysCreate?: boolean;
  apiKeysEdit?: boolean;
  apiKeysDelete?: boolean;
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
      switch (item.displayName) {
        case "Permission:Organizations":
          _permissions.projects = item.isGranted;
          break;
        case "Permission:Organizations.Create":
          _permissions.projectsCreate = item.isGranted;
          break;
        case "Permission:Organizations.Edit":
          _permissions.projectsEdit = item.isGranted;
          break;
        case "Permission:Organizations.Delete":
          _permissions.projectsDelete = item.isGranted;
          break;
        case "Permission:OrganizationMembers":
          _permissions.projectsMembers = item.isGranted;
          break;
        case "Permission:OrganizationMembers.Manage":
          _permissions.projectsMembersManage = item.isGranted;
          break;
        case "Permission:ApiKeys":
          _permissions.apiKeys = item.isGranted;
          break;
        case "Permission:ApiKeys.Create":
          _permissions.apiKeysCreate = item.isGranted;
          break;
        case "Permission:ApiKeys.Edit":
          _permissions.apiKeysEdit = item.isGranted;
          break;
        case "Permission:ApiKeys.Delete":
          _permissions.apiKeysDelete = item.isGranted;
          break;
      }
    });
    return _permissions;
  }, [permissions]);
};
