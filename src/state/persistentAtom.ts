import { atomWithStorage } from "jotai/utils";

export const myPersistentAtom = atomWithStorage("myAtomKey", "default value");
