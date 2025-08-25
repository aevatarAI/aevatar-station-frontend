import dayjs from "@/api/dayjs";
import { describe, expect, it } from "vitest";
import {
  deduplicate,
  generateDates,
  reverse,
  shortenString,
  truncate,
} from "./helpers";

describe("truncate", () => {
  it("should remove the specified sentence from the original string", () => {
    expect(truncate("Hello World", "World")).toBe("Hello ");
    expect(truncate("Test String", "Test")).toBe(" String");
  });

  it("should return original string if sentence not found", () => {
    expect(truncate("Hello World", "Not Found")).toBe("Hello World");
  });
});

describe("shortenString", () => {
  it("should return empty string for invalid input", () => {
    expect(shortenString(undefined)).toBe("");
    expect(shortenString(null as any)).toBe("");
  });

  it("should return original string if length is less than prefix + suffix", () => {
    expect(shortenString("short")).toBe("short");
  });

  it("should shorten string with default prefix and suffix lengths", () => {
    expect(shortenString("abcdefghijklmnopqrstuvwxyz")).toBe("abcde...vwxyz");
  });

  it("should shorten string with custom prefix and suffix lengths", () => {
    expect(shortenString("abcdefghijklmnopqrstuvwxyz", 3, 3)).toBe("abc...xyz");
  });
});

describe("deduplicate", () => {
  it("should return empty array for invalid input", () => {
    expect(deduplicate(null as any, "id")).toEqual([]);
  });

  it("should remove duplicates based on specified key", () => {
    const data = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
      { id: 1, name: "John" },
    ];
    expect(deduplicate(data, "id")).toEqual([
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
    ]);
  });
});

describe("reverse", () => {
  it("should return empty array for invalid input", () => {
    expect(reverse(null as any)).toEqual([]);
  });

  it("should reverse array elements", () => {
    expect(reverse([1, 2, 3])).toEqual([3, 2, 1]);
    expect(reverse(["a", "b", "c"])).toEqual(["c", "b", "a"]);
  });
});

describe("generateDates", () => {
  it("should generate dates between two timestamps", () => {
    const from = dayjs("2024-01-01").valueOf();
    const to = dayjs("2024-01-03").valueOf();
    expect(generateDates(from, to)).toEqual(["01/01", "02/01", "03/01"]);
  });

  it("should handle same day", () => {
    const timestamp = dayjs("2024-01-01").valueOf();
    expect(generateDates(timestamp, timestamp)).toEqual(["01/01"]);
  });
});
