import {jwtDecode} from "jwt-decode";

export const isTokenValid = (): boolean => {
    const token = localStorage.getItem("Token");
    if (!token) return false;

    try {
        const decoded: any = jwtDecode(token);
        const now = Date.now() / 1000; 
        return decoded.exp > now;      
    } catch {
        return false;
    }
};

export const logout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("user");
};
