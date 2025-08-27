import { atom } from "jotai";

export interface TProfileAndOrgDialog {
  open: boolean;
  menu?: "profile" | "organisation";
  tab?: "general" | "notifications" | "member" | "role" | "project";
}

export const PROFILE_DIALOG_ATOM = atom<TProfileAndOrgDialog>({
  open: false,
});
