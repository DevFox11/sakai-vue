/**
 * Servicio de Campañas
 * Maneja todas las peticiones relacionadas con campañas al backend
 */

import apiClient from '@/api/axios';

const campaignService = {
    /**
     * Obtener lista de campañas de la organización
     */
    async getCampaigns(organizationId, status = null) {
        const params = {};
        if (status) params.status = status;

        const response = await apiClient.get('/campaigns/', {
            params,
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    /**
     * Obtener una campaña específica
     */
    async getCampaign(campaignId, organizationId) {
        const response = await apiClient.get(`/campaigns/${campaignId}`, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    /**
     * Crear una nueva campaña
     */
    async createCampaign(campaignData, organizationId) {
        const response = await apiClient.post('/campaigns/', campaignData, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    /**
     * Actualizar una campaña
     */
    async updateCampaign(campaignId, campaignData, organizationId) {
        const response = await apiClient.put(`/campaigns/${campaignId}`, campaignData, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    /**
     * Eliminar una campaña
     */
    async deleteCampaign(campaignId, organizationId) {
        const response = await apiClient.delete(`/campaigns/${campaignId}`, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    /**
     * Obtener estadísticas de una campaña
     */
    async getCampaignStats(campaignId, organizationId) {
        const response = await apiClient.get(`/campaigns/${campaignId}/stats`, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    }
};

export default campaignService;
