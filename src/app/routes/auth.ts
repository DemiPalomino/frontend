import {jwtDecode} from "jwt-decode";

export const isTokenValid = (): boolean => {
    const token = localStorage.getItem("Token");
    if (!token) return false;

    try {
        const decoded: any = jwtDecode(token);
        const now = Date.now() / 1000; // segundos
        return decoded.exp > now;      // true si el token aún no expira
    } catch {
        return false;
    }
};

export const logout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("user");
};
