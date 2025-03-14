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
      roleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      roleName: "owner",
    },
    {
      roleId: "fa85f64-5717-4562-b3fc-2c963f66a",
      roleName: "member",
    },
  ];
};
