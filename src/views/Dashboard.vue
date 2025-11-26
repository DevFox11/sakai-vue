<script setup>
import BestSellingWidget from '@/components/dashboard/BestSellingWidget.vue';
import NotificationsWidget from '@/components/dashboard/NotificationsWidget.vue';
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue';
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue';
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
import { onMounted, ref, onBeforeMount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const { layoutConfig } = useLayout();
const authStore = useAuthStore();
const router = useRouter();
const hasOrganization = ref(true); // Valor por defecto

onBeforeMount(async () => {
  // Verificar si el usuario tiene una organización
  // Aquí se haría una llamada a la API real para verificar si el usuario tiene organización
  // Por ahora, simularemos la verificación (en producción, debería devolver true/false desde el backend)
  try {
    // await checkUserOrganization();
    // Simulamos que el usuario no tiene organización
    // En la implementación real, esto vendría de la API
    // Por ahora, en desarrollo, asumiremos que el usuario no tiene organización
    // En un entorno real, aquí se haría una llamada para verificar si el usuario tiene una organización
    hasOrganization.value = false; // Suponemos que no tiene organización para propósitos de desarrollo

    if (!hasOrganization.value) {
      // Redirigir a la página de creación de organización
      router.push({ name: 'noOrganization' });
    }
  } catch (error) {
    console.error('Error verificando organización:', error);
  }
});

// Función para verificar si el usuario tiene una organización
// async function checkUserOrganization() {
  // Aquí se llamaría a un servicio real para verificar si el usuario tiene organización
  // const response = await organizationService.getUserOrganization(authStore.user.id);
  // hasOrganization.value = response.hasOrganization;
// }
</script>

<template>
    <div class="px-4 pt-4">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-surface-900 dark:text-white">Panel de Control</h1>
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
