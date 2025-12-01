/**
 * Store de organizaciones con Pinia
 * Gestiona el estado de las organizaciones del usuario y la organización actualmente seleccionada
 */

import { defineStore } from 'pinia';
import apiClient from '@/api/axios';
import { useAuthStore } from '@/stores/auth';

export const useOrganizationsStore = defineStore('organizations', {
    // Estado
    state: () => ({
        userOrganizations: [],
        currentOrganization: null,
        loading: false,
        error: null
    }),

    // Getters (computed properties)
    getters: {
        /**
         * Verifica si el usuario tiene organizaciones
         */
        hasOrganizations: (state) => {
            return state.userOrganizations && state.userOrganizations.length > 0;
        },

        /**
         * Obtiene el nombre de la organización actual
         */
        currentOrganizationName: (state) => {
            return state.currentOrganization?.name || '';
        },

        /**
         * Obtiene el ID de la organización actual
         */
        currentOrganizationId: (state) => {
            return state.currentOrganization?.id || null;
        }
    },

    // Acciones
    actions: {
        /**
         * Carga las organizaciones del usuario
         */
        async loadUserOrganizations() {
            this.loading = true;
            this.error = null;

            try {
                const response = await apiClient.get('/organizations');
                
                this.userOrganizations = response.data;

                // Si hay organizaciones y no hay una seleccionada actualmente, seleccionar la primera
                if (response.data && response.data.length > 0 && !this.currentOrganization) {
                    this.currentOrganization = response.data[0];
                }

                return response.data;
            } catch (error) {
                this.error = this.handleError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Establece la organización actual
         * @param {Object} organization - Organización a seleccionar
         */
        setCurrentOrganization(organization) {
            this.currentOrganization = organization;
            // Guardar en localStorage para persistencia
            if (organization) {
                localStorage.setItem('currentOrganization', JSON.stringify(organization));
            } else {
                localStorage.removeItem('currentOrganization');
            }
        },

        /**
         * Selecciona una organización por ID
         * @param {number} organizationId - ID de la organización
         */
        async selectOrganizationById(organizationId) {
            const organization = this.userOrganizations.find(org => org.id === organizationId);
            
            if (organization) {
                this.setCurrentOrganization(organization);
                return organization;
            } else {
                throw new Error('Organización no encontrada');
            }
        },

        /**
         * Crea una nueva organización
         * @param {Object} organizationData - Datos de la nueva organización
         */
        async createOrganization(organizationData) {
            try {
                const response = await apiClient.post('/organizations', organizationData);
                
                // Añadir la nueva organización a la lista
                this.userOrganizations.push(response.data);
                
                // Seleccionar automáticamente la nueva organización
                this.setCurrentOrganization(response.data);

                return response.data;
            } catch (error) {
                this.error = this.handleError(error);
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
        },

        /**
         * Restaura la organización seleccionada desde localStorage
         */
        restoreCurrentOrganization() {
            try {
                const organizationStr = localStorage.getItem('currentOrganization');
                if (organizationStr) {
                    const organization = JSON.parse(organizationStr);
                    // Verificar si es un objeto válido con id
                    if (organization && organization.id) {
                        this.currentOrganization = organization;
                        return organization;
                    }
                }
            } catch (error) {
                console.error('Error al restaurar la organización desde localStorage:', error);
            }
            return null;
        }
    }
});