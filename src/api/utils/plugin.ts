import { request } from "@/api";
import type { TDataResponse } from "@/api/types/index";

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
): Promise<IDllPlugin[]> => {
  const result: TDataResponse<{ items: IDllPlugin[] }> =
    await request.plugins.getPlugins({
      params: { projectId },
    });
  return result.data?.items ?? [];
};

export interface ICrossURL {
  id: string;
  domain: string;
  creationTime: number;
  creatorName: string;
}

export const getCrossURLs = async (projectId: string): Promise<ICrossURL[]> => {
  // Mock data for demonstration
  return [
    {
      id: "1",
      domain: "https://example.com/api1",
      creationTime: Date.now() - 100000,
      creatorName: "Alice",
    },
    {
      id: "2",
      domain: "https://example.com/api2",
      creationTime: Date.now() - 50000,
      creatorName: "Bob",
    },
    {
      id: "3",
      domain: "https://example.com/api3",
      creationTime: Date.now(),
      creatorName: "Charlie",
    },
  ];
};

export const restartToApplyConfig = async (): Promise<void> => {
  // await request.plugins.restartToApplyConfig();
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

export const getRestartStatus = async (): Promise<boolean> => {
  // await request.plugins.getRestartStatus();
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return true;
};
