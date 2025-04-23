import { getDllPlugins } from "@/api/utils/plugin";
import { useToast } from "@/hooks/use-toast";
import { DLL_LIST_ATOM } from "@/state/atoms/dll";
import { handleErrorMessage } from "@/utils/error";
import { useAtom } from "jotai";
import { useCallback } from "react";

export const useUpdateDllList = () => {
  const [, setDllList] = useAtom(DLL_LIST_ATOM);
  const { toast } = useToast();

  return useCallback(
    async (id: string) => {
      try {
        const list = await getDllPlugins(id);

        setDllList(list);
      } catch (error) {
        toast({
          description: handleErrorMessage(error, "fetch Project error"),
        });
      }
    },
    [setDllList, toast],
  );
};
