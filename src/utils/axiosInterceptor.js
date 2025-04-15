import axios from 'axios';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';

const axiosInterceptor = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInterceptor.interceptors.request.use(
  (config) => {
    const conf = config;
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      if (config.headers) conf.headers.Authorization = `Bearer ${accessToken}`;
    }
    return conf;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInterceptor.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axiosInterceptor.post('/auth/token/refresh/', { refresh: refreshToken });
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          error.config.headers.Authorization = `Bearer ${access}`;
          return axiosInterceptor(error.config);
        } catch (refreshError) {
          const authStore = useAuthStore();
          authStore.logout();
          router.push('/login');
        }
      } else {
        const authStore = useAuthStore();
        authStore.logout();
        router.push('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInterceptor;
 