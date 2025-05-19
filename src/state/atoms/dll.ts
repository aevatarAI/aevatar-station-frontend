import type { IDllPlugin } from "@/api/utils/plugin";
import { atomWithStorage } from "jotai/utils";

export const DLL_LIST_ATOM = atomWithStorage<IDllPlugin[]>(
  "dll_list_atom",
  [],
  undefined,
  { getOnInit: true },
);

export const RESTART_POD_SERVER_TIME_ATOM = atomWithStorage<
  | {
      time: number;
    }
  | undefined
>("restart_pod_server_time_atom", undefined, undefined, {
  getOnInit: true,
});
