import axiosInterceptor from '@/utils/axiosInterceptor';

export const auth = {
    login(email, password) {
        return axiosInterceptor.post('/auth/login', {
            email,
            password
        });
    },
    isAuthenticated() {
        const accessToken = localStorage.getItem('access_token');
        return accessToken ? axiosInterceptor.get('/auth/user') : Promise.reject('No token');
    },
    refreshToken() {
        const refreshToken = localStorage.getItem('refresh_token');
        return axiosInterceptor.post('/auth/token/refresh/', { refresh: refreshToken });
    },
    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
}