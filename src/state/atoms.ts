import type { TAtomicAevatar } from "@/assets/schema/atomic-aevatar";
import { atom } from "jotai";

export const loadingAtom = atom(false);
export const atomicAevatarAtom = atom<TAtomicAevatar[]>([]);

// login
export const accessTokenAtom = atom<string | null>(null);
