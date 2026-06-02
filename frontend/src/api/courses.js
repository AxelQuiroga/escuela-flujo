import { apiClient } from './client';

export const coursesApi = {
  getAll: async () => {
    const response = await apiClient.get('/courses');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/courses', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/courses/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/courses/${id}`);
    return response.data;
  }
};
