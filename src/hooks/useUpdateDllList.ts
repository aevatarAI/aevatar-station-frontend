import { getDllPlugins } from "@/api/utils/plugin";
import { useToast } from "@/hooks/use-toast";
import { DLL_LIST_ATOM } from "@/state/atoms/dll";
import { handleErrorMessage } from "@/utils/error";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { useCurrentProject } from "./useCurrentProject";

export const useUpdateDllList = () => {
  const [, setDllList] = useAtom(DLL_LIST_ATOM);
  const { toast } = useToast();
  const curProject = useCurrentProject();
  return useCallback(
    async (id: string) => {
      try {
        const list = await getDllPlugins(id, curProject?.domainName || "");

        setDllList(list);
      } catch (error) {
        toast({
          description: handleErrorMessage(error, "fetch Project error"),
        });
      }
    },
    [setDllList, toast, curProject?.domainName],
  );
};
