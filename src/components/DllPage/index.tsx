import { getServiceHealthStatus } from "@/api/utils/apiWithDomain";
import CrossURL from "@/components/CrossURL";
import DllTable from "@/components/DllTable";
import { RESTART_POD_SERVER_TIME_ATOM } from "@/state/atoms/dll";
import { useAtom } from "jotai";
import { useCallback } from "react";
import Configuration from "./Configuration";

export default function DllPage() {
  const [, setRestartPodServerTime] = useAtom(RESTART_POD_SERVER_TIME_ATOM);

  const onRestart = useCallback(async () => {
    try {
      const result = await getServiceHealthStatus("developer-client");
      console.log(result, "getServiceHealthStatus==result");
      setRestartPodServerTime({
        time: new Date().getTime(),
      });
    } catch (error) {
      console.log(error, "error=onRestart=");
    }
  }, [setRestartPodServerTime]);
  return (
    <div>
      <Configuration onRestart={onRestart} />
      <DllTable />
      <div className="pt-[30px]" />
      <CrossURL />
    </div>
  );
}
