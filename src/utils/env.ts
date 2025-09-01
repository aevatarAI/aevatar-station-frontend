/**
 * Environment configuration loader
 * Loads environment variables based on the current mode
 */

export interface EnvConfig {
  VITE_APP_NETWORKTYPE: string;
  VITE_APP_SIGNAL_R_URL: string;
  VITE_APP_DOMAIN_URL: string;
  VITE_PROXY_AUTH_URL: string;
  VITE_PROXY_API_URL: string;
  VITE_GITHUB_CLIENT_ID: string;
  VITE_GITHUB_REDIRECT_URI: string;
  VITE_GITHUB_SCOPE: string;
  VITE_GOOGLE_CLIENT_ID: string;
}

export const getEnvConfig = (): EnvConfig => {
  return {
    VITE_APP_NETWORKTYPE: import.meta.env.VITE_APP_NETWORKTYPE || "TESTNET",
    VITE_APP_SIGNAL_R_URL: import.meta.env.VITE_APP_SIGNAL_R_URL || "",
    VITE_APP_DOMAIN_URL: import.meta.env.VITE_APP_DOMAIN_URL || "",
    VITE_PROXY_AUTH_URL: import.meta.env.VITE_PROXY_AUTH_URL || "",
    VITE_PROXY_API_URL: import.meta.env.VITE_PROXY_API_URL || "",
    VITE_GITHUB_CLIENT_ID: import.meta.env.VITE_GITHUB_CLIENT_ID || "",
    VITE_GITHUB_REDIRECT_URI: import.meta.env.VITE_GITHUB_REDIRECT_URI || "",
    VITE_GITHUB_SCOPE: import.meta.env.VITE_GITHUB_SCOPE || "",
    VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
  };
};

export const isDevelopment = () => import.meta.env.DEV === true;
export const isProduction = () => import.meta.env.MODE === "production-local";
export const isLocal = () => import.meta.env.MODE === "local-dev";

export const getCurrentMode = () => import.meta.env.MODE;
