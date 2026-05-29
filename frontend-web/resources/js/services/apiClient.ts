export type ApiResponse<T> = {
    data?: T;
    message?: string;
    errors?: Record<string, string[]>;
};

export class ApiError extends Error {
    status: number;
    errors?: Record<string, string[]>;

    constructor(message: string, status: number, errors?: Record<string, string[]>) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.errors = errors;
    }
}

export const apiErrorMessage = (caught: unknown, fallback: string) => {
    if (caught instanceof ApiError) {
        if (caught.status === 401) return 'Sesion expirada o token invalido. Vuelve a iniciar sesion.';
        if (caught.status === 403) return 'Tu usuario no tiene permisos para esta accion.';
        if (caught.status === 422 && caught.errors) return Object.values(caught.errors).flat().join(' ');
        return caught.message || fallback;
    }

    if (caught instanceof TypeError) return 'No fue posible conectar con el backend. Verifica que http://localhost:8088 este activo.';

    return fallback;
};

const TOKEN_KEY = 'proviemplea_demo_token';
const USER_KEY = 'proviemplea_demo_user';

const apiBaseUrl = `${import.meta.env.VITE_BACKEND_API_URL ?? 'http://localhost:8088/api'}/${import.meta.env.VITE_BACKEND_API_VERSION ?? 'v1'}`;

export const tokenStorage = {
    get: () => localStorage.getItem(TOKEN_KEY),
    set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
    clear: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },
};

export const userStorage = {
    get: <T>() => {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? (JSON.parse(raw) as T) : null;
    },
    set: (user: unknown) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
};

type RequestOptions = RequestInit & { token?: string | null };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const token = options.token ?? tokenStorage.get();
    const headers = new Headers(options.headers);

    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${apiBaseUrl}${path}`, { ...options, headers });

    const contentType = response.headers.get('content-type') ?? '';
    const payload = contentType.includes('application/json') ? await response.json() : await response.text();

    if (!response.ok) {
        const message = typeof payload === 'string' ? payload : payload.message;
        if (response.status === 401) tokenStorage.clear();
        throw new ApiError(message || 'Error en API ProviEmplea.', response.status, payload.errors);
    }

    return payload as T;
}

export const apiClient = {
    get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' }),
    post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
        request<T>(path, { ...options, method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body ?? {}) }),
    put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
        request<T>(path, { ...options, method: 'PUT', body: JSON.stringify(body ?? {}) }),
    delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'DELETE' }),
};
