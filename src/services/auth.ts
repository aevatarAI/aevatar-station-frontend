import { fetcher } from "@/lib/fetcher";
import { LoginMockData } from "@/utils/mock-data";
const SCOPE = "Aevatar";
const CLIENT_ID = "AevatarAuthServer";
const LOGIN_URL = "/connect/token";

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
