import { jwtDecode } from "jwt-decode";
import { TokenProps } from "@/types/interface";

export const isTokenValid = (): boolean => {
  const token = localStorage.getItem("access-token");

  if (!token) return false;

  try {
    const decoded: TokenProps = jwtDecode(token);

    if (decoded.exp < Date.now() / 1000) {
      localStorage.removeItem("access-token");
      return false;
    }

    return true;
  } catch {
    localStorage.removeItem("access-token");
    return false;
  }
};
