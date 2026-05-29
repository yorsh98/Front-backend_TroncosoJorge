import { apiClient } from './apiClient';

export const companyService = {
    profile: () => apiClient.get('/empresa/profile'),
    updateProfile: (payload: unknown) => apiClient.put('/empresa/profile', payload),
    talents: (query = '') => apiClient.get(`/empresa/talentos${query}`),
    talent: (blindCvCode: string) => apiClient.get(`/empresa/talentos/${blindCvCode}`),
    requestContact: (blindCvCode: string, payload: unknown) => apiClient.post(`/empresa/talentos/${blindCvCode}/request-contact`, payload),
    contactRequests: () => apiClient.get('/empresa/contact-requests'),
};
