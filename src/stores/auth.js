/**
 * Store de autenticación con Pinia
 * Gestiona el estado de autenticación del usuario y las operaciones relacionadas
 */

import { defineStore } from 'pinia';
import authService from '@/api/authService';
import { saveTokens, getTokens, clearTokens, saveUser, getUser, clearAuth } from '@/utils/storage';

export const useAuthStore = defineStore('auth', {
    // Estado
    state: () => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        loading: false,
        error: null
    }),

    // Getters (computed properties)
    getters: {
        /**
         * Verifica si el usuario está autenticado
         */
        isAuthenticated: (state) => {
            return !!(state.accessToken && state.user);
        },

        /**
         * Obtiene el nombre del usuario actual
         */
        userName: (state) => {
            return state.user?.name || state.user?.first_name || state.user?.full_name || '';
        },

        /**
         * Obtiene el email del usuario actual
         */
        userEmail: (state) => {
            return state.user?.email || '';
        }
    },

    // Acciones
    actions: {
        /**
         * Carga los datos del usuario desde localStorage al iniciar la app
         */
        loadUserFromStorage() {
            const tokens = getTokens();
            const user = getUser();

            if (tokens && user) {
                this.accessToken = tokens.access_token;
                this.refreshToken = tokens.refresh_token;
                this.user = user;
            }
        },

        /**
         * Inicia sesión con email y contraseña
         * @param {string} email - Email del usuario
         * @param {string} password - Contraseña del usuario
         */
        async login(email, password) {
            this.loading = true;
            this.error = null;

            try {
                // Llamar al servicio de autenticación
                const response = await authService.login(email, password);

                // Guardar tokens y usuario
                this.accessToken = response.access_token;
                this.refreshToken = response.refresh_token;
                this.user = response.user;

                // Persistir en localStorage
                saveTokens(response.access_token, response.refresh_token);
                saveUser(response.user);

                return response;
            } catch (error) {
                this.error = this.handleError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Registra un nuevo usuario
         * @param {string} name - Nombre del usuario
         * @param {string} email - Email del usuario
         * @param {string} password - Contraseña del usuario
         */
        async register(name, email, password) {
            this.loading = true;
            this.error = null;

            try {
                // Llamar al servicio de autenticación
                const response = await authService.register(name, email, password);

                // Guardar tokens y usuario (auto-login después del registro)
                this.accessToken = response.access_token;
                this.refreshToken = response.refresh_token;
                this.user = response.user;

                // Persistir en localStorage
                saveTokens(response.access_token, response.refresh_token);
                saveUser(response.user);

                return response;
            } catch (error) {
                this.error = this.handleError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Cierra la sesión del usuario
         */
        async logout() {
            try {
                // Intentar hacer logout en el backend
                await authService.logout();
            } catch (error) {
                console.error('Error during logout:', error);
                // Continuar con el logout local incluso si falla el backend
            } finally {
                // Limpiar estado
                this.user = null;
                this.accessToken = null;
                this.refreshToken = null;
                this.error = null;

                // Limpiar localStorage
                clearAuth();
            }
        },

        /**
         * Renueva el access token usando el refresh token
         */
        async refreshAccessToken() {
            try {
                if (!this.refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await authService.refreshToken(this.refreshToken);

                // Actualizar tokens
                this.accessToken = response.access_token;
                this.refreshToken = response.refresh_token;

                // Persistir nuevos tokens
                saveTokens(response.access_token, response.refresh_token);

                return response;
            } catch (error) {
                // Si falla el refresh, hacer logout
                await this.logout();
                throw error;
            }
        },

        /**
         * Maneja los errores de las peticiones
         * @param {Error} error - Error capturado
         * @returns {string} Mensaje de error formateado
         */
        handleError(error) {
            if (error.response) {
                // El servidor respondió con un código de error
                const status = error.response.status;
                const data = error.response.data;

                // Si hay un mensaje específico en 'detail', úsalo
                let message = data.detail;

                // Si 'detail' es un array (errores de validación de Pydantic), únelos
                if (Array.isArray(message)) {
                    message = message.map(err => err.msg || JSON.stringify(err)).join(', ');
                }

                if (message) return message;

                switch (status) {
                    case 400:
                        return 'Solicitud incorrecta. Verifica los datos.';
                    case 401:
                        return 'Credenciales incorrectas. Intenta de nuevo.';
                    case 403:
                        return 'No tienes permiso para realizar esta acción.';
                    case 404:
                        return 'Recurso no encontrado.';
                    case 422:
                        return 'Error de validación. Revisa los campos.';
                    case 500:
                        return 'Error interno del servidor. Intenta más tarde.';
                    default:
                        return 'Ocurrió un error inesperado.';
                }
            } else if (error.request) {
                // La petición se hizo pero no hubo respuesta
                return 'No se pudo conectar con el servidor. Verifica tu conexión.';
            } else {
                // Algo más causó el error
                return error.message || 'Error desconocido al procesar la solicitud.';
            }
        }
    }
});
