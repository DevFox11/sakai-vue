/**
 * Store de campañas con Pinia
 * Gestiona el estado de las campañas y la campaña actualmente seleccionada.
 * Toda la información de la app (leads, conversaciones, estadísticas) depende
 * de la campaña seleccionada.
 */

import { defineStore } from 'pinia';

export const useCampaignsStore = defineStore('campaigns', {
    // Estado
    state: () => ({
        campaigns: [
            { id: 1, name: 'Black Friday 2026', emoji: '🛒', status: 'active', leads: 342, budget: 15000, startDate: '2026-11-20', endDate: '2026-11-30' },
            { id: 2, name: 'Lanzamiento Producto X', emoji: '🚀', status: 'active', leads: 128, budget: 8500, startDate: '2026-01-15', endDate: '2026-03-15' },
            { id: 3, name: 'Email Remarketing Q1', emoji: '📧', status: 'paused', leads: 89, budget: 3200, startDate: '2026-01-01', endDate: '2026-03-31' },
            { id: 4, name: 'Redes Sociales Verano', emoji: '☀️', status: 'draft', leads: 0, budget: 5000, startDate: '2026-06-01', endDate: '2026-08-31' },
            { id: 5, name: 'Webinar IA para Ventas', emoji: '🤖', status: 'active', leads: 56, budget: 2000, startDate: '2026-02-01', endDate: '2026-02-28' }
        ],
        currentCampaign: null,
        loading: false
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
         * Inicializa el store: restaura la campaña seleccionada de localStorage o selecciona la primera
         */
        initialize() {
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
                default: return status;
            }
        }
    }
});
