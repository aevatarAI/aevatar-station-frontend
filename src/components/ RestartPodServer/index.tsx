import { getRestartStatus } from "@/api/utils/plugin";
import Loading from "@/assets/loading.svg?react";
import { useToast } from "@/hooks/use-toast";
import { RESTART_POD_SERVER_ATOM } from "@/state/atoms/dll";
import { delay } from "@/utils/common";
import clsx from "clsx";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import { useCallback, useEffect } from "react";

export default function RestartPodServer() {
  const { toast } = useToast();
  const [restartPodServer, setRestartPodServer] = useAtom(
    RESTART_POD_SERVER_ATOM,
  );
  const loopGetRestartStatus = useCallback(async () => {
    if (restartPodServer) {
      const { dismiss } = toast({
        description: (
          <div className="flex items-center gap-[5px]">
            <Loading
              className={clsx("aevatarai-loading-icon")}
              style={{ width: 14, height: 14 }}
            />
            <span>service restarting...</span>
          </div>
        ),
        duration: 9999999999999,
      });

      let isFinish = false;
      while (!isFinish) {
        const result = await getRestartStatus(restartPodServer.domain);
        if (result) {
          isFinish = true;
          setRestartPodServer(RESET);
          dismiss();
          toast({
            description: "service restarted successfully",
          });
        }
        await delay(3000);
      }
    }
  }, [restartPodServer, toast, setRestartPodServer]);

  useEffect(() => {
    loopGetRestartStatus();
  }, [loopGetRestartStatus]);

  return null;
}
