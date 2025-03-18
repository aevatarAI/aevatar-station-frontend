import type { TDataResponse } from "@/api/types/index";
import { request } from "..";
import type { IPermissionsItem, IRoleItem } from "@/api/utils/organization";

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
  projectId: string
): Promise<IMemberItem[]> => {
  const result: TDataResponse<{ items: IMemberItem[] }> =
    await request.projects.getProjectMembers({
      query: projectId,
    });
  return result.data?.items ?? [];
};

export const getProjectRoles = async (
  projectId: string
): Promise<IRoleItem[]> => {
  const result: TDataResponse<{ items: IRoleItem[] }> =
    await request.projects.getProjectRoles({
      query: projectId,
    });
  return result.data.items;
};
