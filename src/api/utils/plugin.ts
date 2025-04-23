import { request } from "@/api";
import type { TDataResponse } from "@/api/types/index";
import { sleep } from "@etransfer/utils";

export interface IDllPlugin {
  id: string;
  name: string;
  creationTime: number;
  creatorName: string;
}
export const getDllPlugins = async (
  projectId: string,
): Promise<IDllPlugin[]> => {
  // const result: TDataResponse<{ items: IDllPlugin[] }> =
  //   await request.plugins.getPlugins({
  //     params: { projectId },
  //   });
  // return result.data?.items ?? [];
  await sleep(2000);
  return [
    {
      id: "xxxxx",
      name: "dll1",
      creationTime: Date.now(),
      creatorName: "creatorName",
    },
  ];
};
