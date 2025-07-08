import Loading from "@/assets/loading.svg?react";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";
import { useCallback } from "react";

export const useToastLoading = () => {
  const { toast } = useToast();
  return useCallback(() => {
    return toast({
      description: (
        <div className="flex gap-[8px]">
          <Loading
            className={clsx("aevatarai-loading-icon")}
            style={{ width: 14, height: 14 }}
          />
          <div className="text-white font-outfit text-[12px] font-normal leading-normal lowercase">
            loading...
          </div>
        </div>
      ),
    });
  }, [toast]);
};
