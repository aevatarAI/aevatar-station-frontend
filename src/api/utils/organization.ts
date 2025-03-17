import type { TDataResponse } from "@/api/types/index";
import { request } from "..";
import { sleep } from "@etransfer/utils";

export interface IOrganizationItem {
  id: string;
  displayName: string;
  memberCount: number;
  creationTime: number;
}

export const getOrganizationList = async (): Promise<IOrganizationItem[]> => {
  // const result: TDataResponse<{ items: IOrganizationItem[] }> =
  //   await request.organizations.getUserOrganizations();
  // if (result.code !== "SUCCESS_CODE") throw result.message;
  // return result.data.items;
  await sleep(1000);
  return [
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      displayName: "orgName",
      memberCount: 0,
      creationTime: Date.now(),
    },
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6aa",
      displayName: "orgName name",
      memberCount: 0,
      creationTime: Date.now(),
    },
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66aafa6aa",
      displayName: "orgName name name",
      memberCount: 0,
      creationTime: Date.now(),
    },
  ];
};

export interface IProjectItem {
  id: string;
  displayName: string;
  domainName: string;
  memberCount: number;
  creationTime: number;
}

export const getProjectList = async (
  organizationId: string
): Promise<IProjectItem[]> => {
  await sleep(1000);
  return [
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      displayName: "projectName",
      domainName: "string",
      memberCount: 0,
      creationTime: Date.now(),
    },
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa61",
      displayName: "projectName name",
      domainName: "string",
      memberCount: 0,
      creationTime: Date.now(),
    },
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa62",
      displayName: "projectName name name",
      domainName: "string",
      memberCount: 0,
      creationTime: Date.now(),
    },
  ];
  // const result: TDataResponse<{ items: IProjectItem[] }> =
  //   await request.organizations.getUserOrganizations({
  //     params: {
  //       organizationId,
  //     },
  //   });
  // if (result.code !== "SUCCESS_CODE") throw result.message;
  // return result.data.items;
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
  // const result: TDataResponse<{ items: IPermissionsItem[] }> =
  //   await request.organizations.getOrganizationPermissions({
  //     query: organizationId,
  //   });
  // return result.data?.items;
  await sleep(3000);
  return [
    {
      name: "DeveloperPlatform.Organizations",
      displayName: "Permission:Organizations",
      parentName: null,
      isGranted: true,
      allowedProviders: [],
      grantedProviders: [],
    },
    {
      name: "DeveloperPlatform.Organizations.Create",
      displayName: "Permission:Organizations.Create",
      parentName: "DeveloperPlatform.Organizations",
      isGranted: true,
      allowedProviders: [],
      grantedProviders: [],
    },
    {
      name: "DeveloperPlatform.Organizations.Edit",
      displayName: "Permission:Organizations.Edit",
      parentName: "DeveloperPlatform.Organizations",
      isGranted: true,
      allowedProviders: [],
      grantedProviders: [],
    },
    {
      name: "DeveloperPlatform.Organizations.Delete",
      displayName: "Permission:Organizations.Delete",
      parentName: "DeveloperPlatform.Organizations",
      isGranted: true,
      allowedProviders: [],
      grantedProviders: [],
    },
    {
      name: "DeveloperPlatform.OrganizationMembers",
      displayName: "Permission:OrganizationMembers",
      parentName: null,
      isGranted: true,
      allowedProviders: [],
      grantedProviders: [],
    },
    {
      name: "DeveloperPlatform.OrganizationMembers.Manage",
      displayName: "Permission:OrganizationMembers.Manage",
      parentName: "DeveloperPlatform.OrganizationMembers",
      isGranted: true,
      allowedProviders: [],
      grantedProviders: [],
    },
    {
      name: "DeveloperPlatform.ApiKeys",
      displayName: "Permission:ApiKeys",
      parentName: null,
      isGranted: true,
      allowedProviders: [],
      grantedProviders: [],
    },
    {
      name: "DeveloperPlatform.ApiKeys.Create",
      displayName: "Permission:ApiKeys.Create",
      parentName: "DeveloperPlatform.ApiKeys",
      isGranted: true,
      allowedProviders: [],
      grantedProviders: [],
    },
    {
      name: "DeveloperPlatform.ApiKeys.Edit",
      displayName: "Permission:ApiKeys.Edit",
      parentName: "DeveloperPlatform.ApiKeys",
      isGranted: true,
      allowedProviders: [],
      grantedProviders: [],
    },
    {
      name: "DeveloperPlatform.ApiKeys.Delete",
      displayName: "Permission:ApiKeys.Delete",
      parentName: "DeveloperPlatform.ApiKeys",
      isGranted: true,
      allowedProviders: [],
      grantedProviders: [],
    },
  ];
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

export interface IMemberItem {
  id: string;
  userName: string;

  email: string;

  roleId: string | null;
}

export const getOrganizationMembers = async (
  organizationId: string
): Promise<IMemberItem[]> => {
  // const result: TDataResponse<{ items: IMemberItem[] }> =
  //   await request.organizations.getOrganizationMembers({
  //     query: organizationId,
  //   });
  // return result.data?.items ?? [];
  return [
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      userName: "string",
      email: "axxx.ss@cxx.com",
      roleId: "fa85f64-5717-4562-b3fc-2c963f66a",
    },
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66af1a6",
      userName: "string1",
      email: "ss.ss@a.cxx",
      roleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    },
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66af1a6",
      userName: "string1",
      email: "aaa.ss@xx.xx",
      roleId: null,
    },
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66af1a6",
      userName: "string1",
      email: "aaa.ss@xx.xxs",
      roleId: "fa85f64-5717-4562-b3fc-2c963f66a",
    },
  ];
};

export interface IRoleItem {
  name: string;
  id: string;
}

export const getOrganizationRoles = async (
  organizationId: string
): Promise<IRoleItem[]> => {
  // const result: TDataResponse<{ items: IRoleItem[] }> =
  //   await request.organizations.getOrganizationRoles({
  //     query: organizationId,
  //   });
  // return result.data.items;
  return [
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      name: "owner",
    },
    {
      id: "fa85f64-5717-4562-b3fc-2c963f66a",
      name: "member",
    },
  ];
};

// roles: [
//   {
//     organizationId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//     roleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//     roleName: "owner",
//   },
//   {
//     organizationId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//     roleId: "fa85f64-5717-4562-b3fc-2c963f66a",
//     roleName: "member",
//   },
// ],
