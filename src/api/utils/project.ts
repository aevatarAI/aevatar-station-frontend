import type { TDataResponse } from "@/api/types/index";
import { request } from "..";
import { sleep } from "@etransfer/utils";
import type { IPermissionsItem, IRoleItem } from "@/api/utils/organization";

export const getProjectPermissions = async (projectId: string) => {
  // const result: TDataResponse<{ items: IPermissionsItem[] }> =
  //   await request.projects.getProjectPermissions({
  //     query: projectId,
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

export interface IMemberItem {
  id: string;
  userName: string;

  email: string;

  roleId: string | null;
}

export const getProjectMembers = async (
  projectId: string
): Promise<IMemberItem[]> => {
  // const result: TDataResponse<{ items: IMemberItem[] }> =
  //   await request.projects.getProjectMembers({
  //     query: projectId,
  //   });
  // return result.data?.items ?? [];
  return [
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      userName: "string",
      email: "string",
      roleId: "fa85f64-5717-4562-b3fc-2c963f66a",
    },
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66af1a6",
      userName: "string1",
      email: "string1",
      roleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    },
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66af1a6",
      userName: "string1",
      email: "string1",
      roleId: null,
    },
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66af1a6",
      userName: "string1",
      email: "string1",
      roleId: "fa85f64-5717-4562-b3fc-2c963f66a",
    },
  ];
};

export const getProjectRoles = async (
  projectId: string
): Promise<IRoleItem[]> => {
  // const result: TDataResponse<{ items: IRoleItem[] }> =
  //   await request.projects.getProjectRoles({
  //     query: projectId,
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
