<script setup>
import BestSellingWidget from '@/components/dashboard/BestSellingWidget.vue';
import NotificationsWidget from '@/components/dashboard/NotificationsWidget.vue';
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue';
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue';
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
import { onMounted, ref, onBeforeMount, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useAuthStore } from '@/stores/auth';
import { useOrganizationsStore } from '@/stores/organizations';
import { useCampaignsStore } from '@/stores/campaigns';
import { useRouter } from 'vue-router';
import apiClient from '@/api/axios';

const { layoutConfig } = useLayout();
const authStore = useAuthStore();
const organizationsStore = useOrganizationsStore();
const campaignsStore = useCampaignsStore();
const router = useRouter();
const hasOrganization = ref(false); // Valor por defecto

onBeforeMount(async () => {
  // Verificar si el usuario tiene una organización
  try {
    await checkUserOrganization();
  } catch (error) {
    console.error('Error verificando organización:', error);
  }
});

// Función para verificar si el usuario tiene una organización
async function checkUserOrganization() {
  try {
    // Llamar al endpoint para listar organizaciones del usuario
    const response = await apiClient.get('/organizations');

    // Si el usuario tiene al menos una organización, tiene acceso al dashboard
    const userHasOrg = response.data && response.data.length > 0;

    if (!userHasOrg) {
      // Si no tiene organizaciones, redirigir a la página de creación
      router.push({ name: 'noOrganization' });
    } else {
      // Si tiene organizaciones, continuar normalmente
      hasOrganization.value = true;

      // Cargar organizaciones en el store y establecer la primera como actual
      organizationsStore.userOrganizations = response.data;
      if (response.data.length > 0 && !organizationsStore.currentOrganization) {
        organizationsStore.currentOrganization = response.data[0];
      }
    }
  } catch (error) {
    console.error('Error obteniendo organizaciones del usuario:', error);
    // En caso de error, asumimos que no tiene organización
    router.push({ name: 'noOrganization' });
  }
}

// Watch: recargar dashboard cuando cambie la campaña
watch(() => campaignsStore.currentCampaignId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    // Aquí se puede recargar datos del dashboard por campaña
    console.log(`Dashboard: campaña cambiada a ${campaignsStore.currentCampaignName}`);
  }
});
</script>

<template>
    <div class="px-4 pt-4">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-surface-900 dark:text-white">
                Panel de Control
                <span v-if="organizationsStore.currentOrganization" class="ml-3 text-xl font-semibold text-primary-600 dark:text-primary-400">
                    - {{ organizationsStore.currentOrganization.name }}
                </span>
            </h1>
            <p class="text-muted-color mt-2">Resumen de tu negocio y desempeño</p>
        </div>

        <!-- Banner de campaña activa -->
        <div v-if="campaignsStore.selectedCampaign" class="campaign-banner mb-6">
            <div class="campaign-banner-content">
                <span class="campaign-banner-emoji">{{ campaignsStore.selectedCampaign.emoji }}</span>
                <div class="campaign-banner-info">
                    <span class="campaign-banner-label">Campaña activa</span>
                    <span class="campaign-banner-name">{{ campaignsStore.selectedCampaign.name }}</span>
                </div>
                <div class="campaign-banner-stats">
                    <div class="campaign-stat">
                        <span class="stat-value">{{ campaignsStore.selectedCampaign.leads }}</span>
                        <span class="stat-label">Leads</span>
                    </div>
                    <div class="campaign-stat">
                        <span class="stat-value">${{ (campaignsStore.selectedCampaign.budget || 0).toLocaleString() }}</span>
                        <span class="stat-label">Presupuesto</span>
                    </div>
                </div>
                <span class="campaign-banner-status" :style="{ background: campaignsStore.getStatusColor(campaignsStore.selectedCampaign.status) + '20', color: campaignsStore.getStatusColor(campaignsStore.selectedCampaign.status) }">
                    {{ campaignsStore.getStatusLabel(campaignsStore.selectedCampaign.status) }}
                </span>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-6">
            <StatsWidget />

            <div class="col-span-12 lg:col-span-6 xl:col-span-6">
                <RecentSalesWidget />
            </div>
            <div class="col-span-12 lg:col-span-6 xl:col-span-6">
                <RevenueStreamWidget />
            </div>
            <div class="col-span-12 lg:col-span-6 xl:col-span-6">
                <BestSellingWidget />
            </div>
            <div class="col-span-12 lg:col-span-6 xl:col-span-6">
                <NotificationsWidget />
            </div>
        </div>
    </div>
</template>

<style scoped>
.campaign-banner {
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    transition: all 0.2s;
}

.campaign-banner:hover {
    border-color: var(--primary-300);
    box-shadow: 0 2px 12px rgba(59, 130, 246, 0.08);
}

.campaign-banner-content {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.campaign-banner-emoji {
    font-size: 2rem;
    line-height: 1;
}

.campaign-banner-info {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.campaign-banner-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-color-secondary);
    font-weight: 600;
}

.campaign-banner-name {
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--text-color);
}

.campaign-banner-stats {
    display: flex;
    gap: 1.5rem;
}

.campaign-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.campaign-stat .stat-value {
    font-weight: 700;
    font-size: 1rem;
    color: var(--text-color);
}

.campaign-stat .stat-label {
    font-size: 0.65rem;
    color: var(--text-color-secondary);
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.campaign-banner-status {
    padding: 0.3rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
}
</style>
