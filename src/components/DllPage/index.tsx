import { restartProjectServer } from "@/api/utils/project";
import CrossURL from "@/components/CrossURL";
import DllTable from "@/components/DllTable";
import { useToast } from "@/hooks/use-toast";
import { useCurrentProject } from "@/hooks/useCurrentProject";
import { RESTART_POD_SERVER_ATOM } from "@/state/atoms/dll";
import { handleErrorMessage } from "@/utils/error";
import { useAtom } from "jotai";
import { useCallback } from "react";
import Configuration from "./Configuration";

export default function DllPage() {
  const [, setRestartPodServer] = useAtom(RESTART_POD_SERVER_ATOM);
  const { toast } = useToast();
  const curProject = useCurrentProject();

  const onRestart = useCallback(async () => {
    try {
      const result = await restartProjectServer(curProject?.id ?? "");
      console.log(result, "restartProjectServer==result");

      setRestartPodServer({
        domain: curProject?.domainName ?? "",
        projectId: curProject?.id ?? "",
      });
    } catch (error) {
      console.log(error, "error=onRestart=");
      toast({
        description: handleErrorMessage(error, "service restart failed"),
      });
    }
  }, [setRestartPodServer, curProject?.id, curProject?.domainName, toast]);
  return (
    <div>
      <Configuration onRestart={onRestart} />
      <DllTable />
      <div className="pt-[30px]" />
      <CrossURL />
    </div>
  );
}
