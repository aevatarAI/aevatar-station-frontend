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
