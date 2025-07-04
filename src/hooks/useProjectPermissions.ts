import { getProjectPermissions } from "@/api/utils/project";
import { useToast } from "@/hooks/use-toast";
import { CURRENT_PROJECT_ATOM } from "@/state/atoms/organisation";
import { PROJECT_PERMISSION_ATOM } from "@/state/atoms/permissions";
import { handleErrorMessage } from "@/utils/error";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";

type TUserPermissions = {
  organizations?: boolean;
  organizationsCreate?: boolean;
  organizationsEdit?: boolean;
  organizationsDelete?: boolean;
  member?: boolean;
  memberManage?: boolean;
  projects?: boolean;
  projectsCreate?: boolean;
  projectsEdit?: boolean;
  projectsDelete?: boolean;

  apiKeys?: boolean;
  apiKeysCreate?: boolean;
  apiKeysEdit?: boolean;
  apiKeysDelete?: boolean;
  role?: boolean;
  roleCreate?: boolean;
  roleEdit?: boolean;
  roleDelete?: boolean;
  dashboards?: boolean;
  llmsModels?: boolean;
  apiRequests?: boolean;
  plugins?: boolean;
  pluginsCreate?: boolean;
  pluginsEdit?: boolean;
  pluginsDelete?: boolean;
  corsOrigins?: boolean;
  corsOriginsCreate?: boolean;
  corsOriginsEdit?: boolean;
  corsOriginsDelete?: boolean;
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
          _permissions.organizations = item.isGranted;
          break;
        case "Permission:Organizations.Create":
          _permissions.organizationsCreate = item.isGranted;
          break;
        case "Permission:Organizations.Edit":
          _permissions.organizationsEdit = item.isGranted;
          break;
        case "Permission:Organizations.Delete":
          _permissions.organizationsDelete = item.isGranted;
          break;
        case "Permission:Projects":
          _permissions.projects = item.isGranted;
          break;
        case "Permission:Projects.Create":
          _permissions.projectsCreate = item.isGranted;
          break;
        case "Permission:Projects.Edit":
          _permissions.projectsEdit = item.isGranted;
          break;
        case "Permission:Projects.Delete":
          _permissions.projectsDelete = item.isGranted;
          break;
        case "Permission:Members":
          _permissions.member = item.isGranted;
          break;
        case "Permission:Members.Manage":
          _permissions.memberManage = item.isGranted;
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

        case "Permission:Roles":
          _permissions.role = item.isGranted;
          break;
        case "Permission:Roles.Create":
          _permissions.roleCreate = item.isGranted;
          break;
        case "Permission:Roles.Edit":
          _permissions.roleEdit = item.isGranted;
          break;
        case "Permission:Roles.Delete":
          _permissions.roleDelete = item.isGranted;
          break;

        case "Permission:Dashboards":
          _permissions.dashboards = item.isGranted;
          break;
        case "Permission:LLMSModels":
          _permissions.llmsModels = item.isGranted;
          break;
        case "Permission:ApiRequests":
          _permissions.apiRequests = item.isGranted;
          break;
        case "Permission:Plugins":
          _permissions.plugins = item.isGranted;
          break;
        case "Permission:Plugins.Create":
          _permissions.pluginsCreate = item.isGranted;
          break;
        case "Permission:Plugins.Edit":
          _permissions.pluginsEdit = item.isGranted;
          break;
        case "Permission:Plugins.Delete":
          _permissions.pluginsDelete = item.isGranted;
          break;
        case "Permission:ProjectCorsOrigins":
          _permissions.corsOrigins = item.isGranted;
          break;
        case "Permission:ProjectCorsOrigins.Create":
          _permissions.corsOriginsCreate = item.isGranted;
          break;
        case "Permission:ProjectCorsOrigins.Edit":
          _permissions.corsOriginsEdit = item.isGranted;
          break;
        case "Permission:ProjectCorsOrigins.Delete":
          _permissions.corsOriginsDelete = item.isGranted;
          break;
      }
    });
    return _permissions;
  }, [permissions]);
};
