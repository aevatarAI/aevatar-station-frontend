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
      name: "create",
    },
    {
      name: "edit",
    },
    {
      name: "delete",
    },
    {
      name: "memberAdd",
    },
    {
      name: "memberDelete",
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
  roleId: string;
  roleName: string;
}

export interface IMemberItem {
  userId: string;
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
      userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      userName: "string",
      email: "string",
      roleId: "fa85f64-5717-4562-b3fc-2c963f66a",
    },
    {
      userId: "3fa85f64-5717-4562-b3fc-2c963f66af1a6",
      userName: "string1",
      email: "string1",
      roleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    },
    {
      userId: "3fa85f64-5717-4562-b3fc-2c963f66af1a6",
      userName: "string1",
      email: "string1",
      roleId: null,
    },
    {
      userId: "3fa85f64-5717-4562-b3fc-2c963f66af1a6",
      userName: "string1",
      email: "string1",
      roleId: "fa85f64-5717-4562-b3fc-2c963f66a",
    },
  ];
};

export interface IRoleItem {
  organizationId: string;
  roleName: string;
  roleId: string;
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
      organizationId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      roleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      roleName: "owner",
    },
    {
      organizationId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      roleId: "fa85f64-5717-4562-b3fc-2c963f66a",
      roleName: "member",
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
