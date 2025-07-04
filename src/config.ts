export const isDevelopment = () => {
  return import.meta.env.DEV === true;
};

export const isProduction = () => {
  return import.meta.env.PROD === true;
};

export const SIGNAL_R_URL =
  "https://station-developer-dev-staging.aevatar.ai/developer-client/api/notifications";
