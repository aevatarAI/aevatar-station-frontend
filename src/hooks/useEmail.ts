import { useAccessTokenAtom } from "@/hooks/useAccessToken";
import type { IUserProfile } from "@/state/atoms/profile";
import { type JwtPayload, jwtDecode } from "jwt-decode";

interface JwtPayloadExtend extends JwtPayload, IUserProfile {
  email: string;
  role?: string;
  preferred_username: string;
}

export const useEmail = () => {
  const accessToken = useAccessTokenAtom();

  if (!accessToken) {
    return "";
  }

  const decoded = jwtDecode<JwtPayloadExtend>(accessToken);
  return decoded?.email ? decoded.email : "";
};

export const useJWTDecode = () => {
  const decodeJwt = (accessToken: string) => {
    const decoded = jwtDecode<JwtPayloadExtend>(accessToken);
    return decoded;
  };

  return { decodeJwt };
};
