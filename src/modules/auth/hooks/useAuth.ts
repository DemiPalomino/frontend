import { useState, useEffect } from "react";
import { LoginService, logoutService, LoginResponse } from "../services/LoginService";

export function useAuth() {
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem("Token")
    );
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("Token");
        
        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem("user");
                localStorage.removeItem("Token");
            }
        }
    }, []);

    async function login(username: string, password: string): Promise<LoginResponse> {
        setLoading(true);
        try {
            const data = await LoginService(username, password);
            setToken(data.token);
            setUser(data.user);
            
            localStorage.setItem("Token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            
            return data;
        } catch (error) {
            setToken(null);
            setUser(null);
            localStorage.removeItem("Token");
            localStorage.removeItem("user");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        await logoutService();
        setToken(null);
        setUser(null);
    }

    return { 
        token, 
        user,
        login, 
        logout, 
        loading,
        isAuthenticated: !!token 
    };
}