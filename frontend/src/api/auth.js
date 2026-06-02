import { apiClient } from './client';

export const authApi = {
  login: async (credentials) => {
    // credentials: { email, password }
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    // userData: { name, lastName, email, password, role }
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  }
};
