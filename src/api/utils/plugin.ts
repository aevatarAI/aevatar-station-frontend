import { request } from "@/api";
import type { TDataResponse } from "@/api/types/index";
import { getServiceHealthStatus } from "@/api/utils/apiWithDomain";

export enum ELoadStatus {
  Uploaded = -1,
  Deployed = 0,
  AgentRepeat = 1,
  DllAlreadyExists = 2,
  OtherError = 3,
}
export interface IDllPlugin {
  id: string;
  name: string;
  creationTime: number;
  lastModificationTime: number;
  lastModifierName: string | null;
  creatorName: string;
  loadStatus: ELoadStatus;
  reason?: string;
}

export const getDllPlugins = async (
  projectId: string,
  domainName: string,
): Promise<IDllPlugin[]> => {
  const result: TDataResponse<{ items: IDllPlugin[] }> =
    await request.plugins.getPlugins({
      params: { projectId },
      query: `${domainName}-client`,
    });
  return result.data?.items ?? [];
};

export interface ICrossURL {
  projectId: string;
  creationTime: number;
  creatorName: string;
  domain: string;
  id: string;
}

export const getCrossURLs = async (projectId: string): Promise<ICrossURL[]> => {
  const result: TDataResponse<{ items: ICrossURL[] }> =
    await request.projects.getProjectCorsOriginList({
      query: projectId,
    });
  return result.data?.items ?? [];
};

export const addProjectCorsOrigin = async (
  projectId: string,
  domain: string,
): Promise<ICrossURL> => {
  return request.projects.addProjectCorsOrigin({
    query: projectId,
    data: {
      domain,
    },
  });
};

export const deleteProjectCorsOrigin = async (
  projectId: string,
  domainId: string,
): Promise<void> => {
  await request.projects.deleteProjectCorsOrigin({
    query: projectId,
    query1: domainId,
  });
};

export const getRestartStatus = async (domain: string): Promise<boolean> => {
  const result = await getServiceHealthStatus(domain);
  console.log(result, "getRestartStatus==result");
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return result === "Healthy";
};
