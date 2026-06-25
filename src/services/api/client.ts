const API_BASE_URL = 'https://ifome.juniorslab.online';

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token_ifome') : null;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const resposta = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!resposta.ok) {
        if (resposta.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('token_ifome');
        }
        throw new Error(`Erro na API (${resposta.status})`);
    }

    return resposta.json();
}