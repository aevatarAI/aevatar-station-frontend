import { fetcher } from "@/lib/fetcher";
import {
  LoginMockData,
  RegisterMockData,
  SendRegisterCodeMockData,
} from "@/utils/mock-data";
const SCOPE = "Aevatar";
const CLIENT_ID = "AevatarAuthServer";
const LOGIN_URL = "/connect/token";
const REGISTER_URL = "/api/account/register";
const SEND_REGISTER_CODE_URL = "/api/account/send-register-code";
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
    LoginMockData,
  );
};

export const sendRegisterCode = async (email: string) => {
  return fetcher(
    SEND_REGISTER_CODE_URL,
    {
      method: "POST",
      body: {
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
