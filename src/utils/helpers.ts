export const truncate = (original: string, sentenceToRemove: string) => {
    return original.replace(sentenceToRemove, '');
}

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
    set.add(datum[key])
    return true
  })
}

export const reverse = (data: any[]) => {
  if (!data) {
    return []
  }
  const results = [];

  for (let i = data.length - 1; i > -1; i--) {
    const item = data[i];
    results.push(item)
  }
  return results
}

export const NEW = "new";
export const OWNER = "owner"
export const READER = "reader"

export const getUserRole = (decodedAccessToken: any) => {
  if (!decodedAccessToken) return "";
  const roles = decodedAccessToken.role
  let roleType = NEW

  if (Array.isArray(roles)) {
    roles.forEach((role) => {
      if (role?.toLowerCase().includes(READER)) {
        roleType = READER
      } else {
        roleType = OWNER
      }
    })
  }
  return roleType
}
