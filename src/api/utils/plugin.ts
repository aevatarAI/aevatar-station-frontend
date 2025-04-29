import { request } from "@/api";
import type { TDataResponse } from "@/api/types/index";

export interface IDllPlugin {
  id: string;
  name: string;
  creationTime: number;
  creatorName: string;
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
