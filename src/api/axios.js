/**
 * Cliente Axios configurado para comunicarse con el backend FastAPI
 * Incluye interceptores para manejo automático de tokens JWT
 */

import axios from 'axios';
import { useLoading } from '@/composables/useLoading';

// Crear instancia de Axios con configuración base
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor de Request: Añade el token de autenticación automáticamente
apiClient.interceptors.request.use(
    (config) => {
        // Activar loading
        const { startLoading } = useLoading();
        startLoading();

        // Obtener token del localStorage
        const tokens = JSON.parse(localStorage.getItem('auth_tokens') || '{}');
        const accessToken = tokens.access_token;

        // Si existe token, añadirlo al header
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        const { stopLoading } = useLoading();
        stopLoading();
        return Promise.reject(error);
    }
);

// Interceptor de Response: Maneja errores y refresh token automático
apiClient.interceptors.response.use(
    (response) => {
        // Desactivar loading
        const { stopLoading } = useLoading();
        stopLoading();

        // Si la respuesta es exitosa, retornarla directamente
        return response;
    },
    async (error) => {
        const { stopLoading } = useLoading();
        // No detenemos el loading inmediatamente si vamos a reintentar (refresh token)
        // pero para simplificar y evitar que se quede pegado en errores, lo paramos aquí
        // y si el refresh inicia uno nuevo, bien.
        stopLoading();

        const originalRequest = error.config;

        // Si el error es 401 (no autorizado) y no hemos intentado refresh aún
        // Y NO es una petición al endpoint de login (para evitar bucle infinito si fallan las credenciales)
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login')) {
            originalRequest._retry = true;

            try {
                // Intentar renovar el token
                const tokens = JSON.parse(localStorage.getItem('auth_tokens') || '{}');
                const refreshToken = tokens.refresh_token;

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Llamar al endpoint de refresh
                const response = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
                    { refresh_token: refreshToken }
                );

                // Guardar nuevos tokens
                const newTokens = {
                    access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token
                };
                localStorage.setItem('auth_tokens', JSON.stringify(newTokens));

                // Reintentar la petición original con el nuevo token
                originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
                return apiClient(originalRequest);

            } catch (refreshError) {
                // Si el refresh falla, limpiar tokens y redirigir al login
                localStorage.removeItem('auth_tokens');
                localStorage.removeItem('auth_user');
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            }
        }

        // Para otros errores, rechazar la promesa
        return Promise.reject(error);
    }
);

export default apiClient;
