import { apiClient, tokenStorage, userStorage } from './apiClient';

export type AuthUser = {
    id: number;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
};

type AuthResponse = {
    token_type: 'Bearer';
    access_token: string;
    user: AuthUser;
};

export const authService = {
    async login(email: string, password: string) {
        const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
        tokenStorage.set(response.access_token);
        userStorage.set(response.user);
        return response;
    },
    async logout() {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            tokenStorage.clear();
        }
    },
    me: () => apiClient.get<{ user: AuthUser }>('/auth/me'),
    async registerPersona(payload: { name: string; email: string; password: string; password_confirmation: string }) {
        const response = await apiClient.post<AuthResponse>('/auth/register/persona', payload);
        tokenStorage.set(response.access_token);
        userStorage.set(response.user);
        return response;
    },
    async registerEmpresa(payload: { name: string; email: string; password: string; password_confirmation: string }) {
        const response = await apiClient.post<AuthResponse>('/auth/register/empresa', payload);
        tokenStorage.set(response.access_token);
        userStorage.set(response.user);
        return response;
    },
};
