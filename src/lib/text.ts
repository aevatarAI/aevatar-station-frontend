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
