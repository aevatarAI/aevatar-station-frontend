import type { TAtomicAevatar } from "@/assets/schema/atomic-aevatar";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const loadingAtom = atom(false);
export const atomicAevatarAtom = atom<TAtomicAevatar[]>([]);

// login
export const accessTokenAtom = atomWithStorage<string | null>(
  "access_token",
  null,
  undefined,
  { getOnInit: true }
);
// register
const getSessionValue = (type: string) => {
  const stored = sessionStorage.getItem(type);
  return stored ? stored : '';
}
export const usernameAtom = atom(getSessionValue("username"),
  (_, set, username: string) => {
    sessionStorage.setItem("username", username);
    set(usernameAtom, username);
  }
)
export const emailAtom = atom(getSessionValue("email"),
  (_, set, email: string) => {
    sessionStorage.setItem("email", email);
    set(emailAtom, email);
  }
)
export const passwordAtom = atom(getSessionValue("password"),
  (_, set, password: string) => {
    sessionStorage.setItem("password", password);
    set(passwordAtom, password);
  } 
)
