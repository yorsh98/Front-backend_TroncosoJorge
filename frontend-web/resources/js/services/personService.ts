import { apiClient } from './apiClient';

export const personService = {
    profile: () => apiClient.get('/persona/profile'),
    updateProfile: (payload: unknown) => apiClient.put('/persona/profile', payload),
    completion: () => apiClient.get('/persona/profile/completion'),
    educations: () => apiClient.get('/persona/educations'),
    createEducation: (payload: unknown) => apiClient.post('/persona/educations', payload),
    updateEducation: (id: number, payload: unknown) => apiClient.put(`/persona/educations/${id}`, payload),
    deleteEducation: (id: number) => apiClient.delete(`/persona/educations/${id}`),
    experiences: () => apiClient.get('/persona/experiences'),
    createExperience: (payload: unknown) => apiClient.post('/persona/experiences', payload),
    updateExperience: (id: number, payload: unknown) => apiClient.put(`/persona/experiences/${id}`, payload),
    deleteExperience: (id: number) => apiClient.delete(`/persona/experiences/${id}`),
    skills: () => apiClient.get('/persona/skills'),
    createSkill: (payload: unknown) => apiClient.post('/persona/skills', payload),
    deleteSkill: (id: number) => apiClient.delete(`/persona/skills/${id}`),
    blindCvPreview: () => apiClient.get('/persona/blind-cv/preview'),
    requestValidation: () => apiClient.post('/persona/request-validation'),
};
