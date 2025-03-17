import { atomWithStorage } from "jotai/utils";

export interface IUserProfile {
  extraProperties: Record<string, string>;
  userName: string;
  email: string;
  name: string;
  surname: string;
  phoneNumber: string;
  isExternal: boolean;
  hasPassword: boolean;
  concurrencyStamp: string;
}

export const USER_PROFILE_ATOM = atomWithStorage<IUserProfile | null>(
  "user_profile",
  null,
  undefined,
  { getOnInit: true }
);
