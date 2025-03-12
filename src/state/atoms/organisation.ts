import type { IOrganizationItem, IProjectItem } from "@/api/utils/organization";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const ORGANIZATIONS_LIST_ATOM = atomWithStorage<IOrganizationItem[]>(
  "organizations_list_atom",
  [],
  undefined,
  { getOnInit: true }
);

export const CURRENT_ORGANIZATION_ATOM = atomWithStorage<string | null>(
  "current_organization_atom",
  null,
  undefined,
  { getOnInit: true }
);

export const PROJECT_LIST_ATOM = atomWithStorage<IProjectItem[]>(
  "project_list_atom",
  [],
  undefined,
  { getOnInit: true }
);

export const CURRENT_PROJECT_ATOM = atomWithStorage<string | null>(
  "current_project_atom",
  null,
  undefined,
  { getOnInit: true }
);

export const emailAtom = atom("");
export const passwordAtom = atom("");
export const usernameAtom = atom("");
