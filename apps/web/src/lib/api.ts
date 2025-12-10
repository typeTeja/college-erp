import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loop
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = Cookies.get('refresh_token');
                if (!refreshToken) throw new Error('No refresh token');

                // Call refresh endpoint
                // Note: We need a separate instance or carefully avoid using the same interceptor
                // For simplicity, using axios directly here to avoid circular dependency issues if not careful
                const { data } = await axios.post(
                    `${API_URL}/auth/refresh`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${refreshToken}` },
                    }
                );

                const { access_token, refresh_token } = data;

                Cookies.set('access_token', access_token);
                Cookies.set('refresh_token', refresh_token);

                // Update authorization header and retry original request
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Redirect to login if refresh fails
                Cookies.remove('access_token');
                Cookies.remove('refresh_token');
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
