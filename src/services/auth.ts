import { fetcher } from "@/lib/fetcher";
import {
  LoginMockData,
  RegisterMockData,
  SendRegisterCodeMockData,
} from "@/utils/mock-data";
export const GITHUB = "github";
export const SCOPE = "Aevatar offline_access";
export const CLIENT_ID = "AevatarAuthServer";
export const LOGIN_URL = "/connect/token";
const REGISTER_URL = "/api/account/register";
const SEND_REGISTER_CODE_URL = "/api/account/send-register-code";
const RESET_TOEKN_URL = "/api/account/verify-password-reset-token";
const SEND_PASSWORD_REST_CODE_URL = "/api/account/send-password-reset-code";
const RESET_PASSWORD_URL = "/api/account/reset-password";
export const login = async (username: string, password: string) => {
  return fetcher(
    LOGIN_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "password",
        scope: SCOPE,
        username,
        password,
        client_id: CLIENT_ID,
      }).toString(),
    },
    // LoginMockData,
  );
};

export const refreshTokenLogin = async (
  refreshToken: string,
): Promise<{
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}> => {
  return fetcher(LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: CLIENT_ID,
      refresh_token: refreshToken,
    }).toString(),
  });
};

export const sendRegisterCode = async (userName: string, email: string) => {
  return fetcher(
    SEND_REGISTER_CODE_URL,
    {
      method: "POST",
      body: {
        userName,
        email,
        appName: SCOPE,
      },
    },
    SendRegisterCodeMockData,
  );
};

export const register = async (userData: {
  userName: string;
  emailAddress: string;
  password: string;
  code: string;
}) => {
  return fetcher(
    REGISTER_URL,
    {
      method: "POST",
      body: {
        ...userData,
        appName: SCOPE,
      },
    },
    RegisterMockData,
  );
};

export const verifyResetToken = async (userId: string, resetToken: string) => {
  return fetcher(RESET_TOEKN_URL, {
    method: "POST",
    body: { userId, resetToken },
  });
};
export const resetPassword = async (
  userId: string,
  resetToken: string,
  password: string,
) => {
  return fetcher(RESET_PASSWORD_URL, {
    method: "POST",
    body: { userId, resetToken, password },
  });
};

export const sendResetPasswordEmail = async (email: string) => {
  return fetcher(SEND_PASSWORD_REST_CODE_URL, {
    method: "POST",
    body: { email, appName: SCOPE },
  });
};
