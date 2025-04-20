import { SUCCESS_CODE } from "@/api/constants";
import type { TDataResponse } from "@/api/types/index";
import { request } from "..";

export interface IOrganizationItem {
  id: string;
  displayName: string;
  memberCount: number;
  creationTime: number;
}

export const getOrganizationList = async (): Promise<IOrganizationItem[]> => {
  const result: TDataResponse<{ items: IOrganizationItem[] }> =
    await request.organizations.getUserOrganizations();
  if (result.code !== SUCCESS_CODE) throw result.message;
  return result.data.items;
};

export interface IProjectItem {
  id: string;
  displayName: string;
  domainName: string;
  memberCount: number;
  creationTime: number;
}

export const getProjectList = async (
  organizationId: string,
): Promise<IProjectItem[]> => {
  const result: TDataResponse<{ items: IProjectItem[] }> =
    await request.projects.getUserProject({
      params: {
        organizationId,
      },
    });
  if (result.code !== SUCCESS_CODE) throw result.message;
  return result.data.items;
};

export interface IPermissionsItem {
  name: string;
  displayName: string;
  parentName?: null | string;
  isGranted: boolean;
  allowedProviders: any[];
  grantedProviders: any[];
}

export const getOrganizationPermissions = async (organizationId: string) => {
  const result: TDataResponse<{ items: IPermissionsItem[] }> =
    await request.organizations.getOrganizationPermissions({
      query: organizationId,
    });
  return result.data?.items;
};

export enum InvitationStatus {
  Pending = 0,
  Joined = 1,
  Declined = 2,
}

export interface IRoles {
  organizationId: string;
  id: string;
  name: string;
}

export enum IMemberStatus {
  joined = 0,
  pending = 1,
  refused = 2,
}

export interface IMemberItem {
  id: string;
  userName: string;
  email: string;
  roleId: string | null;
  status?: IMemberStatus;
}

export const getOrganizationMembers = async (
  organizationId: string,
): Promise<IMemberItem[]> => {
  const result: TDataResponse<{ items: IMemberItem[] }> =
    await request.organizations.getOrganizationMembers({
      query: organizationId,
    });
  return result.data?.items ?? [];
};

export interface IRoleItem {
  name: string;
  id: string;
}

export const getOrganizationRoles = async (
  organizationId: string,
): Promise<IRoleItem[]> => {
  const result: TDataResponse<{ items: IRoleItem[] }> =
    await request.organizations.getOrganizationRoles({
      query: organizationId,
    });
  return result.data.items;
};

export interface IRolePermissionsItem {
  name: string;
  displayName: string;
  parentName?: string | null;
  isGranted?: boolean;
  allowedProviders: string[];
  grantedProviders: { providerName: string; providerKey: string }[];
}

export interface IRolePermissionGroupsItem {
  name: string;
  displayName: string;
  displayNameKey: string;
  displayNameResource: string;
  permissions: IRolePermissionsItem[];
}

export interface IRolePermission {
  entityDisplayName: string;
  groups: IRolePermissionGroupsItem[];
}

export const getOrganizationRolesPermission = async (
  organizationId: string,
  params: { providerName: string; providerKey: string },
): Promise<IRolePermission> => {
  const result: TDataResponse<IRolePermission> =
    await request.organizations.getOrganizationRolePermissions({
      query: organizationId,
      params,
    });

  return result.data;
};
