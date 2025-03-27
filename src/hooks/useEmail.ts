import { jwtDecode, JwtPayload } from "jwt-decode";
import { useAccessTokenAtom } from "@/hooks/useAccessToken";

interface JwtPayloadExtend extends JwtPayload {
    email: string;
}


export const useEmail = () => {
    const accessToken = useAccessTokenAtom();
    const decoded = jwtDecode<JwtPayloadExtend>(accessToken);
    return decoded?.email ? decoded.email : "";
  }