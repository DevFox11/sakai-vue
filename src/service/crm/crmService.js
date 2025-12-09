/**
 * Servicio de CRM y Gestión de Leads
 * Maneja todas las peticiones relacionadas con leads, etapas y actividades al backend
 */

import apiClient from '@/api/axios';

const crmService = {
    /**
     * Pipelines
     */

    // Crear un nuevo pipeline
    async createPipeline(pipelineData, organizationId) {
        const response = await apiClient.post('/leads/pipelines/', pipelineData, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    // Obtener lista de pipelines
    async getPipelines(organizationId) {
        const response = await apiClient.get('/leads/pipelines/', {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    // Obtener un pipeline específico
    async getPipeline(pipelineId, organizationId) {
        const response = await apiClient.get(`/leads/pipelines/${pipelineId}`, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    // Actualizar un pipeline
    async updatePipeline(pipelineId, pipelineData, organizationId) {
        const response = await apiClient.put(`/leads/pipelines/${pipelineId}`, pipelineData, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    // Eliminar un pipeline
    async deletePipeline(pipelineId, organizationId) {
        const response = await apiClient.delete(`/leads/pipelines/${pipelineId}`, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    // Obtener etapas de un pipeline específico
    async getPipelineStages(pipelineId, organizationId) {
        const response = await apiClient.get(`/leads/pipelines/${pipelineId}/stages`, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    // Obtener todas las etapas de la organización (para búsquedas y filtros)
    async getAllStages(organizationId) {
        const response = await apiClient.get('/leads/stages/', {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    /**
     * Leads
     */

    // Crear un nuevo lead
    async createLead(leadData, organizationId) {
        const response = await apiClient.post('/leads/', leadData, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    // Obtener lista de leads
    async getLeads(organizationId, params = {}) {
        const response = await apiClient.get('/leads/', {
            params,
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    // Obtener un lead específico
    async getLead(leadId, organizationId) {
        const response = await apiClient.get(`/leads/${leadId}`, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    // Actualizar un lead
    async updateLead(leadId, leadData, organizationId) {
        const response = await apiClient.put(`/leads/${leadId}`, leadData, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    // Eliminar un lead
    async deleteLead(leadId, organizationId) {
        const response = await apiClient.delete(`/leads/${leadId}`, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    /**
     * Stages (Pipeline)
     */

    // Obtener etapas del pipeline
    async getStages(organizationId) {
        const response = await apiClient.get('/leads/stages/', {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    // Crear una nueva etapa
    async createStage(stageData, organizationId) {
        const response = await apiClient.post('/leads/stages/', stageData, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    // Actualizar una etapa
    async updateStage(stageId, stageData, organizationId) {
        const response = await apiClient.put(`/leads/stages/${stageId}`, stageData, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    // Eliminar una etapa
    async deleteStage(stageId, organizationId) {
        const response = await apiClient.delete(`/leads/stages/${stageId}`, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    // Mover un lead a una nueva etapa
    async moveLead(leadId, stageId, organizationId) {
        const response = await apiClient.put(`/leads/${leadId}/move/${stageId}`, {}, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    /**
     * Activities
     */

    // Obtener actividades de un lead
    async getLeadActivities(leadId, organizationId, params = {}) {
        const response = await apiClient.get(`/leads/${leadId}/activities`, {
            params,
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    // Crear una nueva actividad para un lead
    async createLeadActivity(leadId, activityData, organizationId) {
        const response = await apiClient.post(`/leads/${leadId}/activities`, activityData, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    // Agregar una nota a un lead
    async addLeadNote(leadId, note, title, organizationId) {
        const response = await apiClient.post(`/leads/${leadId}/note`, {
            note,
            title
        }, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    /**
     * Lead Assignment
     */

    // Asignar un lead a un agente
    async assignLead(leadId, agentId, organizationId) {
        const response = await apiClient.post(`/leads/${leadId}/assign/${agentId}`, {}, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    // Asignación automática de lead
    async autoAssignLead(leadId, strategy, organizationId, options = {}) {
        const response = await apiClient.post(`/leads/auto-assign/${leadId}`, {
            strategy,
            ...options
        }, {
            headers: {
                'X-Organization-ID': organizationId
            }
        });
        return response.data;
    },

    /**
     * UTM Tracking
     */

    // Crear lead con tracking UTM
    async createLeadWithUTM(leadData, organizationId, utmParams = {}) {
        const response = await apiClient.post('/leads/track', leadData, {
            params: {
                organization_id: organizationId,
                ...utmParams
            }
        });
        return response.data;
    },

    // Validar si un lead es duplicado
    async validateLeadDuplicate(email, phone, organizationId) {
        const response = await apiClient.post('/leads/validate-duplicate', null, {
            params: {
                email,
                phone,
                organization_id: organizationId
            }
        });
        return response.data;
    }
};

export default crmService;