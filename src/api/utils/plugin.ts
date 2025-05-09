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
