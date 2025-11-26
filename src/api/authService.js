/**
 * Servicio de autenticación
 * Maneja todas las peticiones relacionadas con autenticación al backend
 */

import apiClient from './axios';

const authService = {
    /**
     * Inicia sesión con email y contraseña
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise} Respuesta con access_token, refresh_token y user
     */
    async login(email, password) {
        const response = await apiClient.post('/auth/login', {
            email,
            password
        });
        return response.data;
    },

    /**
     * Registra un nuevo usuario
     * @param {string} name - Nombre completo del usuario
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise} Respuesta con access_token, refresh_token y user
     */
    async register(name, email, password) {
        const response = await apiClient.post('/auth/register', {
            name,
            email,
            password
        });
        return response.data;
    },

    /**
     * Cierra la sesión del usuario actual
     * @returns {Promise} Confirmación de logout
     */
    async logout() {
        try {
            const response = await apiClient.post('/auth/logout');
            return response.data;
        } catch (error) {
            // Incluso si falla el logout en el backend, limpiar localmente
            console.error('Error during logout:', error);
            throw error;
        }
    },

    /**
     * Renueva el access token usando el refresh token
     * @param {string} refreshToken - Refresh token actual
     * @returns {Promise} Nuevos access_token y refresh_token
     */
    async refreshToken(refreshToken) {
        const response = await apiClient.post('/auth/refresh', {
            refresh_token: refreshToken
        });
        return response.data;
    }
};

export default authService;
