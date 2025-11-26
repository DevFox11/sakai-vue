<template>
    <div class="px-4 pt-4">
        <div class="mb-8 text-center">
            <div class="bg-surface-100 dark:bg-surface-800 border-round mx-auto mb-4 flex align-items-center justify-content-center" style="width: 120px; height: 120px;">
                <i class="pi pi-building text-5xl text-surface-400"></i>
            </div>
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
                @click="createOrganization"
            />
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

const createOrganization = async () => {
    // En el futuro, aquí se abrirá un modal para crear la organización
    // Por ahora, simplemente mostraremos un mensaje de notificación
    toast.add({
        severity: 'info',
        summary: 'Crear Organización',
        detail: 'En breve se abrirá un modal para crear tu organización',
        life: 3000
    });

    console.log('Botón de crear organización presionado');
};
</script>