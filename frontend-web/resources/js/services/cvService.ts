import { apiClient } from './apiClient';

export const cvService = {
    upload(file: File, consentAccepted: boolean) {
        const formData = new FormData();
        formData.append('cv', file);
        formData.append('consent_accepted', consentAccepted ? '1' : '0');
        return apiClient.post('/persona/cv/upload', formData);
    },
    uploads: () => apiClient.get('/persona/cv/uploads'),
    analysis: (id: number) => apiClient.get(`/persona/cv/analysis/${id}`),
    applyToProfile: (id: number) => apiClient.post(`/persona/cv/analysis/${id}/apply-to-profile`),
};
