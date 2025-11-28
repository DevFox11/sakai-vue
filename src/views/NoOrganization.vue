<template>
    <div class="px-4 pt-4">
        <div class="mb-8 text-center">
            <img src="/images/sonreir.png" alt="Sonreír" class="mx-auto mb-4" style="width: 80px; height: 80px;" />
            <h1 class="text-3xl font-bold text-surface-900 dark:text-white mb-4">No tienes una organización</h1>
            <div class="max-w-2xl mx-auto px-4">
                <p class="text-muted-color text-lg text-center block">
                    Parece que aún no has creado una organización. Para comenzar a usar la aplicación, necesitas crear una organización donde podrás gestionar tus prospectos, usuarios y configuraciones.
                </p>
            </div>
        </div>

        <div class="text-center mt-8">
            <Button
                label="Crear Organización"
                icon="pi pi-plus"
                class="p-button-primary p-button-lg"
                @click="showCreateModal = true"
            />
        </div>

        <CreateOrganizationModal
            v-model="showCreateModal"
            @created="onOrganizationCreated"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api/axios';
import CreateOrganizationModal from '@/components/CreateOrganizationModal.vue';

const router = useRouter();
const showCreateModal = ref(false);

// Verificar si el usuario ya tiene organizaciones al cargar el componente
onMounted(async () => {
  try {
    const response = await apiClient.get('/organizations');
    const userHasOrg = response.data && response.data.length > 0;

    // Si el usuario tiene organizaciones, redirigir al dashboard
    if (userHasOrg) {
      router.push({ name: 'dashboard' });
    }
  } catch (error) {
    console.error('Error obteniendo organizaciones del usuario:', error);
  }
});

const onOrganizationCreated = () => {
    // Redirigir al dashboard después de crear la organización
    router.push({ name: 'dashboard' });
};
</script>