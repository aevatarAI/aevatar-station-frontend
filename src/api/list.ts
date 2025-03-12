import type { API_REQ_FUNCTION } from "./types";

export const DEFAULT_METHOD = "GET";

const ORGANIZATIONS_API_LIST = {
  getUserOrganizations: "/api/organizations",
  getOrganizationDetail: "/api/organizations",
  addOrganization: {
    target: "/api/organizations",
    baseConfig: { method: "POST" },
  },
  editOrganization: {
    target: "/api/organizations",
    baseConfig: { method: "PUT" },
  },
  deleteOrganization: {
    target: "/api/organizations",
    baseConfig: { method: "DELETE" },
  },
  getOrganizationMembers: {
    target: "/api/organizations",
    extendUrlSuffix: "/members",
    baseConfig: { method: "GET" },
  },
  editOrganizationMembers: {
    target: "/api/organizations",
    extendUrlSuffix: "/members",
    baseConfig: { method: "PUT" },
  },
  getOrganizationRoles: {
    target: "/api/organizations",
    extendUrlSuffix: "/roles",
    baseConfig: { method: "GET" },
  },
  editOrganizationRoles: {
    target: "/api/organizations",
    extendUrlSuffix: "/member-roles",
    baseConfig: { method: "PUT" },
  },
  getOrganizationPermissions: {
    target: "/api/organizations",
    extendUrlSuffix: "/roles",
    baseConfig: { method: "GET" },
  },
};

export const EXPAND_APIS = {
  organizations: ORGANIZATIONS_API_LIST,
};

export type EXPAND_REQ_TYPES = {
  [X in keyof typeof EXPAND_APIS]: {
    [K in keyof (typeof EXPAND_APIS)[X]]: API_REQ_FUNCTION;
  };
};
