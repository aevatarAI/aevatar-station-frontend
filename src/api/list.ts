import type { API_REQ_FUNCTION } from "./types";

export const getDomainBaseUrl = () => {
  return import.meta.env.VITE_APP_DOMAIN_URL;
};

export const DEFAULT_METHOD = "GET";

const NOTIFICATIONS_API_LIST = {
  getInvites: {
    target: "/api/notification/organization",
    baseConfig: { method: "GET" },
  },
  getUnreadNotifications: {
    target: "/api/notification/unread-count",
    baseConfig: { method: "GET" },
  },
  getNotifications: {
    target: "/api/notification",
    baseConfig: { method: "GET" },
  },
  postReadNotifications: {
    target: "/api/notification/read",
    baseConfig: { method: "POST" },
  },
  updateNotification: {
    target: "/api/notification/response",
    baseConfig: { method: "POST" },
  },
};

const API_KEYS_API_LIST = {
  getAPIKeys: {
    target: "/api/appId",
    baseConfig: { method: "GET" },
  },
  createAPIKey: {
    target: "/api/appId",
    baseConfig: { method: "POST" },
  },
  updateAPIKey: {
    target: "/api/appId",
    baseConfig: { method: "PUT" },
  },
  deleteAPIKey: {
    target: "/api/appId",
    baseConfig: { method: "DELETE" },
  },
};

const API_REQUESTS_API_LIST = {
  getAPIRequest: {
    target: "/api/api-requests",
    baseConfig: { method: "GET" },
  },
  getSystemLLM: {
    target: "/api/token-usage/system-llm",
    baseConfig: { method: "GET" },
  },
  getLLMTokenUsage: {
    target: "/api/token-usage",
    baseConfig: { method: "POST" },
  },
};

const ORGANIZATIONS_API_LIST = {
  getUserOrganizations: "/api/organizations",
  getOrganizationDetail: "/api/organizations",
  createOrganization: {
    target: "/api/organizations",
    baseConfig: { method: "POST" },
  },
  createOrganizationWithDefaultProject: {
    target: "/api/organizations/create-with-default-project",
    baseConfig: { method: "POST" },
  },
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
  getOrganizationRolePermissions: {
    target: "/api/organization-permissions",
    baseConfig: { method: "GET" },
  },
  setOrganizationRolePermissions: {
    target: "/api/organization-permissions",
    baseConfig: { method: "PUT" },
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
  deleteProjectRoles: {
    target: "/api/projects",
    baseConfig: { method: "DELETE" },
  },
  addProjectRoles: {
    target: "/api/projects",
    extendUrlSuffix: "/roles",
    baseConfig: { method: "POST" },
  },
  getProjectRolePermissions: {
    target: "/api/project-permissions",
    baseConfig: { method: "GET" },
  },
  setProjectRolePermissions: {
    target: "/api/project-permissions",
    baseConfig: { method: "PUT" },
  },
  restartProjectServer: {
    target: "/api/developers/service",
    baseConfig: { method: "POST" },
  },
  // cors origin
  getProjectCorsOriginList: {
    target: "/api/projects",
    extendUrlSuffix: "/cors-origins",
    baseConfig: { method: "GET" },
  },
  addProjectCorsOrigin: {
    target: "/api/projects",
    extendUrlSuffix: "/cors-origins",
    baseConfig: { method: "POST" },
  },
  deleteProjectCorsOrigin: {
    target: "/api/projects",
    extendUrlSuffix: "/cors-origins",
    baseConfig: { method: "DELETE" },
  },
  createDefaultProject: {
    target: "/api/projects/default",
    baseConfig: { method: "POST" },
  },
  createDefaultWorkflow: {
    target: getDomainBaseUrl(),
    extendUrlSuffix: "/api/workflow-view/default",
    baseConfig: { method: "POST" },
  },
  updateRecentUsed: {
    target: "/api/projects/recent-used",
    baseConfig: { method: "POST" },
  },
  getRecentUsed: {
    target: "/api/projects/recent-used",
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
const PLUGINS_API_LIST = {
  getPlugins: {
    target: getDomainBaseUrl(),
    extendUrlSuffix: "/api/plugins",
    baseConfig: { method: "GET" },
  },
  addPlugins: {
    target: getDomainBaseUrl(),
    extendUrlSuffix: "/api/plugins",
    baseConfig: { method: "POST" },
  },
  updatePlugins: {
    target: getDomainBaseUrl(),
    extendUrlSuffix: "/api/plugins",
    baseConfig: { method: "PUT" },
  },
  deletePlugins: {
    target: getDomainBaseUrl(),
    extendUrlSuffix: "/api/plugins",
    baseConfig: { method: "DELETE" },
  },
};

export const PROJECT_PRIVATE_DOMAIN_API = {
  getServiceHealthStatus: {
    target: getDomainBaseUrl(),
    baseConfig: { method: "GET" },
    extendUrlSuffix: "/health",
  },
};

export const EXPAND_APIS = {
  apiKeys: API_KEYS_API_LIST,
  apiRequests: API_REQUESTS_API_LIST,
  notifications: NOTIFICATIONS_API_LIST,
  organizations: ORGANIZATIONS_API_LIST,
  projects: PROJECT_API_LIST,
  profile: PROFILE_API_LIST,
  plugins: PLUGINS_API_LIST,
  projectPrivateDomain: PROJECT_PRIVATE_DOMAIN_API,
};

export type EXPAND_REQ_TYPES = {
  [X in keyof typeof EXPAND_APIS]: {
    [K in keyof (typeof EXPAND_APIS)[X]]: API_REQ_FUNCTION;
  };
};
