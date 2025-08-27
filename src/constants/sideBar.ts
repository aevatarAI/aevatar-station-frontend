export const TAB_LIST = [
  "apikeys",
  "usage",
  "g-agents",
  "workflows",
  "configuration",
  "general",
  "notifications",
  "member",
  "role",
  "project",
] as const;

export const MENU_LIST = ["profile", "organisation", "projects"] as const;

export const MENU_MAP_LIST = {
  apikeys: { text: "API Keys", url: "/dashboard/apikeys" },
  usage: { text: "Usage", url: "/dashboard/usage" },
  "g-agents": { text: "G Agents", url: "/dashboard/g-agents" },
  workflows: { text: "Workflows", url: "/dashboard/workflows" },
  configuration: { text: "CORS", url: "/dashboard/configuration" },
  general: { text: "General", url: "/profile/projects/general" },
  notifications: {
    text: "Notifications",
    url: "/profile/projects/notifications",
  },
  member: { text: "Members", url: "/profile/projects/member" },
  role: { text: "Roles", url: "/profile/projects/role" },
} as const;
