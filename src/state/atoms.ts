import type { TAtomicAevatar } from "@/assets/schema/atomic-aevatar";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const loadingAtom = atom(false);
export const atomicAevatarAtom = atom<TAtomicAevatar[]>([]);

// login
export const accessTokenAtom = atomWithStorage<string | null>(
  "access_token",
  null,
);
