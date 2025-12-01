<script setup>
import BestSellingWidget from '@/components/dashboard/BestSellingWidget.vue';
import NotificationsWidget from '@/components/dashboard/NotificationsWidget.vue';
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue';
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue';
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
import { onMounted, ref, onBeforeMount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useAuthStore } from '@/stores/auth';
import { useOrganizationsStore } from '@/stores/organizations';
import { useRouter } from 'vue-router';
import apiClient from '@/api/axios';

const { layoutConfig } = useLayout();
const authStore = useAuthStore();
const organizationsStore = useOrganizationsStore();
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
