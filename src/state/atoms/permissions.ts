import type { IPermissionsItem } from "@/api/utils/organization";
import { atomWithStorage } from "jotai/utils";

export const PROJECT_PERMISSION_ATOM = atomWithStorage<IPermissionsItem[]>(
  "project_permission_atom",
  [],
  undefined,
  { getOnInit: true }
);

export const ORGANIZATION_PERMISSION_ATOM = atomWithStorage<IPermissionsItem[]>(
  "organization_permission_atom",
  [],
  undefined,
  { getOnInit: true }
);
