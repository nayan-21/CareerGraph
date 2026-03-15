import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Configured axios instance for all API calls.
 * Request interceptor automatically injects the JWT Bearer token from localStorage.
 */
const api = axios.create({
    baseURL: BASE_URL
});

// Request Interceptor: Attach Bearer token if it exists in localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
