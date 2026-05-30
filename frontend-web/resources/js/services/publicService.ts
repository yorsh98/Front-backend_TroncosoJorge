import { apiClient } from './apiClient';

export const publicService = {
    stats: () => apiClient.get<{ data: { cv_uploads_total: number } }>('/public/stats'),
};
