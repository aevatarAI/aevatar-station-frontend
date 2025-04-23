import type { IDllPlugin } from "@/api/utils/plugin";
import { atomWithStorage } from "jotai/utils";

export const DLL_LIST_ATOM = atomWithStorage<IDllPlugin[]>(
  "dll_list_atom",
  [],
  undefined,
  { getOnInit: true },
);
