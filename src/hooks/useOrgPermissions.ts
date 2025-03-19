import { getOrganizationPermissions } from "@/api/utils/organization";
import { useToast } from "@/hooks/use-toast";
import { CURRENT_ORGANIZATION_ATOM } from "@/state/atoms/organisation";
import {
  ORGANIZATION_PERMISSION_ATOM,
  PROJECT_PERMISSION_ATOM,
} from "@/state/atoms/permissions";
import { handleErrorMessage } from "@etransfer/utils";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";

type TUserPermissions = {
  organizations?: boolean;
  organizationsCreate?: boolean;
  organizationsEdit?: boolean;
  organizationsDelete?: boolean;
  organizationMembers?: boolean;
  organizationMembersManage?: boolean;
  apiKeys?: boolean;
  apiKeysCreate?: boolean;
  apiKeysEdit?: boolean;
  apiKeysDelete?: boolean;
};

export const useOrgPermissions = () => {
  const [organizationId] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const { toast } = useToast();

  const [permissions, setUserPermissions] = useAtom(
    ORGANIZATION_PERMISSION_ATOM
  );

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
        case "Permission:OrganizationMembers":
          _permissions.organizationMembers = item.isGranted;
          break;
        case "Permission:OrganizationMembers.Manage":
          _permissions.organizationMembersManage = item.isGranted;
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
