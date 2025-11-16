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
        const response = await apiFetch("/login", {
            method: "POST",
            body: JSON.stringify({ usuario, password }),
        });
        
        if (!response.token) {
            throw new Error('Respuesta inválida del servidor');
        }
        
        return response;
    } catch (error: any) {
        console.error('Error en LoginService:', error);
        throw new Error(error.message || 'Error de conexión con el servidor');
    }
}

export async function logoutService() {
    localStorage.removeItem("Token");
    localStorage.removeItem("user");
    return Promise.resolve();
}