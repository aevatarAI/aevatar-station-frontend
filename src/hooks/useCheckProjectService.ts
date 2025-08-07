import { getRestartStatus } from "@/api/utils/plugin";
import { delay } from "@/utils/common";
import { useCallback } from "react";

export const useCheckProjectService = () => {
  return useCallback(async (domain: string) => {
    let isFinish = false;
    while (!isFinish) {
      const result = await getRestartStatus(`${domain}-client`);
      if (result) {
        isFinish = true;
      } else {
        await delay(3000);
      }
    }
  }, []);
};
