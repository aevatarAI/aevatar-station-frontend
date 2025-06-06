import { getServiceHealthStatus } from "@/api/utils/apiWithDomain";
import CrossURL from "@/components/CrossURL";
import DllTable from "@/components/DllTable";
import { useCurrentProject } from "@/hooks/useCurrentProject";
import { RESTART_POD_SERVER_ATOM } from "@/state/atoms/dll";
import { CURRENT_PROJECT_ATOM } from "@/state/atoms/organisation";
import { useAtom } from "jotai";
import { useCallback } from "react";
import Configuration from "./Configuration";

export default function DllPage() {
  const [, setRestartPodServer] = useAtom(RESTART_POD_SERVER_ATOM);

  const curProject = useCurrentProject();

  const onRestart = useCallback(async () => {
    try {
      const domain = "developer-client"; //curProject?.domainName ?? "";
      const result = await getServiceHealthStatus(domain);
      console.log(result, "getServiceHealthStatus==result");
      setRestartPodServer({
        domain,
      });
    } catch (error) {
      console.log(error, "error=onRestart=");
    }
  }, [setRestartPodServer]);
  return (
    <div>
      <Configuration onRestart={onRestart} />
      <DllTable />
      <div className="pt-[30px]" />
      <CrossURL />
    </div>
  );
}
