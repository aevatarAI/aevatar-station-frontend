import type { TDataResponse } from "@/api/types/index";
import type {
  IPermissionsItem,
  IRoleItem,
  IRolePermission,
} from "@/api/utils/organization";
import { request } from "..";

export const getProjectPermissions = async (projectId: string) => {
  const result: TDataResponse<{ items: IPermissionsItem[] }> =
    await request.projects.getProjectPermissions({
      query: projectId,
    });
  return result.data?.items;
};

export interface IMemberItem {
  id: string;
  userName: string;

  email: string;

  roleId: string | null;
}

export const getProjectMembers = async (
  projectId: string,
): Promise<IMemberItem[]> => {
  const result: TDataResponse<{ items: IMemberItem[] }> =
    await request.projects.getProjectMembers({
      query: projectId,
    });
  return result.data?.items ?? [];
};

export const getProjectRoles = async (
  projectId: string,
): Promise<IRoleItem[]> => {
  const result: TDataResponse<{ items: IRoleItem[] }> =
    await request.projects.getProjectRoles({
      query: projectId,
    });
  return result.data.items;
};

export const getProjectRolesPermission = async (
  projectId: string,
  params: { providerName: string; providerKey: string },
): Promise<IRolePermission> => {
  const result: TDataResponse<IRolePermission> =
    await request.projects.getProjectRolePermissions({
      query: projectId,
      params,
    });

  return result.data;
};
