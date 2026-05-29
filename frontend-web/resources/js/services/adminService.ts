import { apiClient } from './apiClient';

export const adminService = {
    dashboard: () => apiClient.get('/admin/dashboard'),
    personas: () => apiClient.get('/admin/personas'),
    persona: (id: number) => apiClient.get(`/admin/personas/${id}`),
    updatePersonaStatus: (id: number, payload: unknown) => apiClient.put(`/admin/personas/${id}/status`, payload),
    empresas: () => apiClient.get('/admin/empresas'),
    empresa: (id: number) => apiClient.get(`/admin/empresas/${id}`),
    updateEmpresaStatus: (id: number, payload: unknown) => apiClient.put(`/admin/empresas/${id}/status`, payload),
    contactRequests: () => apiClient.get('/admin/contact-requests'),
    contactRequest: (id: number) => apiClient.get(`/admin/contact-requests/${id}`),
    updateContactRequestStatus: (id: number, payload: unknown) => apiClient.put(`/admin/contact-requests/${id}/status`, payload),
    addContactRequestNote: (id: number, payload: unknown) => apiClient.post(`/admin/contact-requests/${id}/notes`, payload),
    reportsSummary: () => apiClient.get('/admin/reports/summary'),
    exportUrl: (type: 'talentos' | 'empresas' | 'solicitudes') =>
        `${import.meta.env.VITE_BACKEND_API_URL ?? 'http://localhost:8088/api'}/${import.meta.env.VITE_BACKEND_API_VERSION ?? 'v1'}/admin/reports/export?type=${type}`,
};
