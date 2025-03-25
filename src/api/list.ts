import type { API_REQ_FUNCTION } from "./types";

export const DEFAULT_METHOD = "GET";

const NOTIFICATIONS_API_LIST = {
  getNotifications: {
    target: "/api/notification",
    baseConfig: { method: "GET" },
  },
  updateNotification: {
    target: "/api/notification/response",
    baseConfig: { method: "POST" },
  },
};

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
  addOrganizationRoles: {
    target: "/api/organizations",
    extendUrlSuffix: "/roles",
    baseConfig: { method: "POST" },
  },
  deleteOrganizationRoles: {
    target: "/api/organizations",
    // extendUrlSuffix: "/roles",
    baseConfig: { method: "DELETE" },
  },
  editOrganizationRoles: {
    target: "/api/organizations",
    extendUrlSuffix: "/member-roles",
    baseConfig: { method: "PUT" },
  },
  getOrganizationPermissions: {
    target: "/api/organizations",
    extendUrlSuffix: "/permissions",
    baseConfig: { method: "GET" },
  },
};

const PROJECT_API_LIST = {
  getUserProject: "/api/projects",
  getProjectDetail: "/api/projects",
  addProject: {
    target: "/api/projects",
    baseConfig: { method: "POST" },
  },
  editProject: {
    target: "/api/projects",
    baseConfig: { method: "PUT" },
  },
  deleteProject: {
    target: "/api/projects",
    baseConfig: { method: "DELETE" },
  },
  getProjectMembers: {
    target: "/api/projects",
    extendUrlSuffix: "/members",
    baseConfig: { method: "GET" },
  },
  editProjectMembers: {
    target: "/api/projects",
    extendUrlSuffix: "/members",
    baseConfig: { method: "PUT" },
  },
  getProjectRoles: {
    target: "/api/projects",
    extendUrlSuffix: "/roles",
    baseConfig: { method: "GET" },
  },
  editProjectRoles: {
    target: "/api/projects",
    extendUrlSuffix: "/member-roles",
    baseConfig: { method: "PUT" },
  },
  getProjectPermissions: {
    target: "/api/projects",
    extendUrlSuffix: "/permissions",
    baseConfig: { method: "GET" },
  },
};

const PROFILE_API_LIST = {
  editProfile: {
    target: "/api/account/my-profile",
    baseConfig: { method: "PUT" },
  },
  getProfile: "/api/account/my-profile",
};

export const EXPAND_APIS = {
  notifications: NOTIFICATIONS_API_LIST,
  organizations: ORGANIZATIONS_API_LIST,
  projects: PROJECT_API_LIST,
  profile: PROFILE_API_LIST,
};

export type EXPAND_REQ_TYPES = {
  [X in keyof typeof EXPAND_APIS]: {
    [K in keyof (typeof EXPAND_APIS)[X]]: API_REQ_FUNCTION;
  };
};
