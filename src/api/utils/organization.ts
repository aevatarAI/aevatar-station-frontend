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
}

export interface IMemberItem {
  id: string;
  userName: string;

  email: string;

  roleId: string | null;
  status: IMemberStatus; // 0: joined，1：pending
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

interface IRolePermission {
  entityDisplayName: string;
  groups: IRolePermissionGroupsItem[];
}

export const getOrganizationRolesPermission = async (
  organizationId: string,
  params: { providerName: string; providerKey: string },
): Promise<IRolePermission> => {
  // const result: TDataResponse<{ items: IRolePermission[] }> =
  //   await request.organizations.getOrganizationRolePermissions({
  //     query: organizationId,
  //     params,
  //   });

  // return result.data;

  return {
    entityDisplayName: "entityDisplayName",
    groups: [
      {
        name: "string",
        displayName: "string",
        displayNameKey: "string",
        displayNameResource: "string",
        permissions: [
          {
            name: "permission AA",
            displayName: "permission AA",
            parentName: "permission A",
            isGranted: false,
            allowedProviders: ["string"],
            grantedProviders: [
              {
                providerName: "string",
                providerKey: "string",
              },
            ],
          },
          {
            name: "permission A",
            displayName: "permission A",
            parentName: null,
            isGranted: true,
            allowedProviders: ["string"],
            grantedProviders: [
              {
                providerName: "string",
                providerKey: "string",
              },
            ],
          },
          {
            name: "permission AB",
            displayName: "permission AB",
            parentName: "permission A",
            isGranted: true,
            allowedProviders: ["string"],
            grantedProviders: [
              {
                providerName: "string",
                providerKey: "string",
              },
            ],
          },

          {
            name: "permission BA",
            displayName: "permission BA",
            parentName: "permission B",
            isGranted: true,
            allowedProviders: ["string"],
            grantedProviders: [
              {
                providerName: "string",
                providerKey: "string",
              },
            ],
          },
          {
            name: "permission B",
            displayName: "permission B",
            parentName: null,
            isGranted: true,
            allowedProviders: ["string"],
            grantedProviders: [
              {
                providerName: "string",
                providerKey: "string",
              },
            ],
          },
          {
            name: "permission BB",
            displayName: "permission BB",
            parentName: "permission B",
            isGranted: true,
            allowedProviders: ["string"],
            grantedProviders: [
              {
                providerName: "string",
                providerKey: "string",
              },
            ],
          },

          {
            name: "permission CA",
            displayName: "permission CA",
            parentName: "permission C",
            isGranted: true,
            allowedProviders: ["string"],
            grantedProviders: [
              {
                providerName: "string",
                providerKey: "string",
              },
            ],
          },
          {
            name: "permission C",
            displayName: "permission C",
            parentName: null,
            isGranted: true,
            allowedProviders: ["string"],
            grantedProviders: [
              {
                providerName: "string",
                providerKey: "string",
              },
            ],
          },
          {
            name: "permission CB",
            displayName: "permission CB",
            parentName: "permission C",
            isGranted: true,
            allowedProviders: ["string"],
            grantedProviders: [
              {
                providerName: "string",
                providerKey: "string",
              },
            ],
          },
          {
            name: "permission CAC",
            displayName: "permission CAC",
            parentName: "permission CA",
            isGranted: false,
            allowedProviders: ["string"],
            grantedProviders: [
              {
                providerName: "string",
                providerKey: "string",
              },
            ],
          },
          {
            name: "permission CAB",
            displayName: "permission CAB",
            parentName: "permission CA",
            isGranted: true,
            allowedProviders: ["string"],
            grantedProviders: [
              {
                providerName: "string",
                providerKey: "string",
              },
            ],
          },
          {
            name: "permission CAA",
            displayName: "permission CAA",
            parentName: "permission CA",
            isGranted: true,
            allowedProviders: ["string"],
            grantedProviders: [
              {
                providerName: "string",
                providerKey: "string",
              },
            ],
          },
        ],
      },
    ],
  };
};
