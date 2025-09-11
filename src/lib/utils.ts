import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Mock for testing
if (process.env.NODE_ENV === "test") {
  vi.mock("clsx", () => ({
    __esModule: true,
    default: (...args: any[]) => args.filter(Boolean).join(" "),
    clsx: (...args: any[]) => args.filter(Boolean).join(" "),
  }));

  vi.mock("tailwind-merge", () => ({
    __esModule: true,
    default: (...args: any[]) => args.filter(Boolean).join(" "),
    twMerge: (...args: any[]) => args.filter(Boolean).join(" "),
  }));
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
