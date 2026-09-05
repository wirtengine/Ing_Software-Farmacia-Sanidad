import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de Peticiones: Adjunta el JWT automáticamente
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de Respuestas: Manejo de Expiración (401 / 403)
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Opcional: Si el token caduca o no es válido, se borra
            localStorage.removeItem('jwt_token');
        }
        return Promise.reject(error);
    }
);

export default axiosClient;