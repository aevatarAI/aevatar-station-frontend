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

export const TAB_TEXT_LIST_MAP = {
  apikeys: { text: "API Keys" },
  usage: { text: "Usage" },
  "g-agents": { text: "G-Agents" },
  workflows: { text: "Workflows" },
  configuration: { text: "Configuration" },
  general: { text: "General" },
  notifications: { text: "Notifications" },
  member: { text: "Member" },
  role: { text: "Role" },
  project: { text: "Project" },
} as { [key in (typeof TAB_LIST)[number]]: { text: string } };

export const MENU_LIST = ["profile", "organisation", "projects"] as const;

export const MENU_TEXT_LIST_MAP = {
  profile: { text: "Profile" },
  organisation: { text: "Organisations" },
  projects: { text: "Projects" },
} as { [key in (typeof MENU_LIST)[number]]: { text: string } };
