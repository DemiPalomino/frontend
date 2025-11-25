// CORREGIDO - LoginService.tsx
import { apiFetch } from "../../../app/service/api";

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        user: string;
        role: number;
        id_persona?: number;
        nombres?: string;
        apellidos?: string;
    };
}

export async function LoginService(usuario: string, password: string): Promise<LoginResponse> {
    try {
        const data = await apiFetch("/login", {
            method: "POST",
            body: JSON.stringify({ usuario, password }),
        });
        
        if (!data.token) {
            throw new Error('Respuesta inválida del servidor: no se recibió token');
        }
        
        return data;
    } catch (error: any) {
        if (error.message.includes('401') || error.message.includes('Credenciales')) {
            throw new Error('Usuario o contraseña incorrectos');
        }
        throw new Error(error.message || 'Error de conexión con el servidor');
    }
}

export async function logoutService() {
    localStorage.removeItem("Token");
    localStorage.removeItem("user");
    return Promise.resolve();
}