const API_URL = "http://localhost:3000/api"

export async function apiFetch(
    endpoint: string,
    options: RequestInit = {}
): Promise<any> {
    const token = localStorage.getItem("Token");
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, { 
            ...options, 
            headers 
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `Error ${response.status}: ${response.statusText}`;
            
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || errorData.message || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }
            
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
        
    } catch (error: any) {
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
        }
        throw error;
    }
}