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
          <div className="text-[var(--color-foreground)] font-outfit text-[13px] font-normal leading-normal">
            loading...
          </div>
        </div>
      ),
    });
  }, [toast]);
};
