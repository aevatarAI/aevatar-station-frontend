export const isDevelopment = () => {
  return import.meta.env.DEV === true;
};

export const isProduction = () => {
  return import.meta.env.PROD === true;
};

export const SIGNAL_R_URL = `${
  import.meta.env.VITE_APP_SIGNAL_R_URL ?? ""
}/developer-client/api/notifications`;
