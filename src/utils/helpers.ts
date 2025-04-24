import dayjs from "@/api/dayjs";

export const truncate = (original: string, sentenceToRemove: string) => {
  return original.replace(sentenceToRemove, "");
};

export function shortenString(
  str?: string,
  prefixLength = 5,
  suffixLength = 5
) {
  if (!str || typeof str !== "string") return "";

  if (str.length <= prefixLength + suffixLength) {
    return str;
  }

  return `${str.slice(0, prefixLength)}...${str.slice(-suffixLength)}`;
}

export const deduplicate = (data: any[], key: string) => {
  if (!data) return [];

  const set = new Set();

  return data?.filter((datum) => {
    if (set.has(datum[key])) {
      return false;
    }
    set.add(datum[key]);
    return true;
  });
};

export const reverse = (data: any[]) => {
  if (!data) {
    return [];
  }
  const results = [];

  for (let i = data.length - 1; i > -1; i--) {
    const item = data[i];
    results.push(item);
  }
  return results;
};

export const generateDates = (from: number, to: number) => {
  const dates = [];
  const baseDate = dayjs(from);

  const date1 = dayjs(from);
  const date2 = dayjs(to);
  const diff = date2.diff(date1, "day");

  for (let i = 0; i <= diff; i++) {
    const date = baseDate.add(i, "day");
    dates.push(date.format("DD/MM"));
  }

  return dates;
};
