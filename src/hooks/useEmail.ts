import { useAccessTokenAtom } from "@/hooks/useAccessToken";
import { type JwtPayload, jwtDecode } from "jwt-decode";

interface JwtPayloadExtend extends JwtPayload {
  email: string;
}

export const useEmail = () => {
  const accessToken = useAccessTokenAtom();
  const decoded = jwtDecode<JwtPayloadExtend>(accessToken);
  return decoded?.email ? decoded.email : "";
};
