import axios from 'axios';

export const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL, timeout: 10_000 });
apiClient.interceptors.request.use((config) => {
  const session = localStorage.getItem('onboarding-session');
  if (session) config.headers.Authorization = `Bearer mock-session`;
  return config;
});
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) =>
    Promise.reject(error instanceof Error ? error : new Error('Не удалось выполнить запрос')),
);
