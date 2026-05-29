import { apiClient } from './apiClient';

export const settingsService = {
    ai: () => apiClient.get('/admin/settings/ai'),
    updateAi: (payload: unknown) => apiClient.put('/admin/settings/ai', payload),
    testAiConnection: () => apiClient.post('/admin/settings/ai/test-connection'),
};
