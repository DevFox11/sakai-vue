/**
 * Store de campañas con Pinia
 * Gestiona el estado de las campañas y la campaña actualmente seleccionada.
 * Toda la información de la app (leads, conversaciones, estadísticas) depende
 * de la campaña seleccionada.
 */

import { defineStore } from 'pinia';
import campaignService from '@/service/crm/campaignService';
import { useOrganizationsStore } from '@/stores/organizations';

export const useCampaignsStore = defineStore('campaigns', {
    // Estado
    state: () => ({
        campaigns: [],
        currentCampaign: null,
        loading: false,
        error: null
    }),

    // Getters
    getters: {
        /**
         * Obtiene la campaña actualmente seleccionada
         */
        selectedCampaign: (state) => {
            return state.currentCampaign || state.campaigns[0] || null;
        },

        /**
         * ID de la campaña seleccionada
         */
        currentCampaignId: (state) => {
            return state.currentCampaign?.id || state.campaigns[0]?.id || null;
        },

        /**
         * Nombre de la campaña seleccionada
         */
        currentCampaignName: (state) => {
            return state.currentCampaign?.name || state.campaigns[0]?.name || '';
        },

        /**
         * Total de campañas
         */
        totalCampaigns: (state) => {
            return state.campaigns.length;
        },

        /**
         * Campañas activas
         */
        activeCampaigns: (state) => {
            return state.campaigns.filter(c => c.status === 'active');
        }
    },

    // Acciones
    actions: {
        /**
         * Inicializa el store: carga campañas del backend y restaura selección de localStorage
         */
        async initialize() {
            const organizationsStore = useOrganizationsStore();
            const orgId = organizationsStore.currentOrganizationId;

            if (!orgId) {
                console.warn('Campaigns: No hay organización seleccionada');
                return;
            }

            await this.loadCampaigns(orgId);

            // Restaurar selección de localStorage
            const savedId = localStorage.getItem('currentCampaignId');
            if (savedId) {
                const campaign = this.campaigns.find(c => c.id === parseInt(savedId));
                if (campaign) {
                    this.currentCampaign = campaign;
                    return;
                }
            }
            // Si no hay guardada, seleccionar la primera
            if (this.campaigns.length > 0) {
                this.currentCampaign = this.campaigns[0];
            }
        },

        /**
         * Carga las campañas desde el backend
         * @param {string} organizationId - ID de la organización
         * @param {string} status - Filtro opcional por estado
         */
        async loadCampaigns(organizationId, status = null) {
            this.loading = true;
            this.error = null;
            try {
                const data = await campaignService.getCampaigns(organizationId, status);
                // Mapear campos del backend al formato del frontend
                this.campaigns = data.map(c => ({
                    id: c.id,
                    name: c.name,
                    emoji: c.emoji || '📢',
                    status: c.status || 'draft',
                    budget: parseFloat(c.budget) || 0,
                    startDate: c.start_date,
                    endDate: c.end_date,
                    description: c.description,
                    leads: 0, // Se cargará con stats
                    organization_id: c.organization_id,
                    created_at: c.created_at,
                    updated_at: c.updated_at
                }));
            } catch (error) {
                console.error('Error cargando campañas:', error);
                this.error = 'No se pudieron cargar las campañas';
                this.campaigns = [];
            } finally {
                this.loading = false;
            }
        },

        /**
         * Crea una nueva campaña
         * @param {Object} campaignData - Datos de la campaña
         */
        async createCampaign(campaignData) {
            const organizationsStore = useOrganizationsStore();
            const orgId = organizationsStore.currentOrganizationId;
            if (!orgId) throw new Error('No hay organización seleccionada');

            this.loading = true;
            try {
                const result = await campaignService.createCampaign(campaignData, orgId);
                // Recargar lista completa
                await this.loadCampaigns(orgId);
                return result;
            } catch (error) {
                console.error('Error creando campaña:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Actualiza una campaña existente
         * @param {number} campaignId - ID de la campaña
         * @param {Object} updateData - Datos a actualizar
         */
        async updateCampaign(campaignId, updateData) {
            const organizationsStore = useOrganizationsStore();
            const orgId = organizationsStore.currentOrganizationId;
            if (!orgId) throw new Error('No hay organización seleccionada');

            try {
                const result = await campaignService.updateCampaign(campaignId, updateData, orgId);
                // Recargar lista
                await this.loadCampaigns(orgId);
                // Si es la campaña actual, actualizarla
                if (this.currentCampaign?.id === campaignId) {
                    this.currentCampaign = this.campaigns.find(c => c.id === campaignId) || this.currentCampaign;
                }
                return result;
            } catch (error) {
                console.error('Error actualizando campaña:', error);
                throw error;
            }
        },

        /**
         * Elimina una campaña
         * @param {number} campaignId - ID de la campaña
         */
        async deleteCampaign(campaignId) {
            const organizationsStore = useOrganizationsStore();
            const orgId = organizationsStore.currentOrganizationId;
            if (!orgId) throw new Error('No hay organización seleccionada');

            try {
                await campaignService.deleteCampaign(campaignId, orgId);
                // Si eliminamos la actual, seleccionar la primera
                if (this.currentCampaign?.id === campaignId) {
                    this.currentCampaign = null;
                    localStorage.removeItem('currentCampaignId');
                }
                // Recargar lista
                await this.loadCampaigns(orgId);
                // Re-seleccionar si es necesario
                if (!this.currentCampaign && this.campaigns.length > 0) {
                    this.selectCampaign(this.campaigns[0]);
                }
            } catch (error) {
                console.error('Error eliminando campaña:', error);
                throw error;
            }
        },

        /**
         * Selecciona una campaña. Esto provoca que toda la app recargue sus datos
         * para la nueva campaña seleccionada.
         * @param {Object} campaign - La campaña a seleccionar
         */
        selectCampaign(campaign) {
            this.currentCampaign = campaign;
            localStorage.setItem('currentCampaignId', campaign.id.toString());
        },

        /**
         * Color del estado de una campaña
         * @param {string} status - Estado de la campaña
         * @returns {string} Color hex
         */
        getStatusColor(status) {
            switch (status) {
                case 'active': return '#22c55e';
                case 'paused': return '#f59e0b';
                case 'draft': return '#94a3b8';
                case 'completed': return '#3b82f6';
                default: return '#94a3b8';
            }
        },

        /**
         * Label del estado de una campaña
         * @param {string} status - Estado de la campaña
         * @returns {string} Label legible
         */
        getStatusLabel(status) {
            switch (status) {
                case 'active': return 'Activa';
                case 'paused': return 'Pausada';
                case 'draft': return 'Borrador';
                case 'completed': return 'Completada';
                default: return status;
            }
        }
    }
});
