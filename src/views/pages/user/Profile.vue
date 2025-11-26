<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const handleLogout = async () => {
    try {
        await authStore.logout();
        toast.add({
            severity: 'info',
            summary: 'Sesión cerrada',
            detail: 'Has cerrado sesión exitosamente',
            life: 3000
        });
        router.push('/auth/login');
    } catch (error) {
        router.push('/auth/login');
    }
};
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 md:col-span-6">
            <div class="card h-full">
                <div class="font-semibold text-xl mb-4">Mi Perfil</div>
                <div class="flex flex-col items-center p-6">
                    <div class="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6 text-primary-600 dark:text-primary-400 text-4xl font-bold">
                        {{ authStore.userName.charAt(0).toUpperCase() }}
                    </div>
                    <div class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-2">{{ authStore.userName }}</div>
                    <div class="text-surface-600 dark:text-surface-400 mb-6">{{ authStore.userEmail }}</div>
                    
                    <div class="w-full border-t border-surface-200 dark:border-surface-700 my-4"></div>
                    
                    <div class="w-full">
                        <div class="flex items-center justify-between py-3">
                            <span class="font-medium text-surface-600 dark:text-surface-400">ID de Usuario</span>
                            <span class="text-surface-900 dark:text-surface-0">{{ authStore.user?.id || 'N/A' }}</span>
                        </div>
                        <div class="flex items-center justify-between py-3">
                            <span class="font-medium text-surface-600 dark:text-surface-400">Rol</span>
                            <span class="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-sm font-medium">Administrador</span>
                        </div>
                    </div>

                    <Button label="Cerrar Sesión" icon="pi pi-sign-out" severity="secondary" outlined class="w-full mt-8" @click="handleLogout" />
                </div>
            </div>
        </div>
        
        <div class="col-span-12 md:col-span-6">
            <div class="card h-full">
                <div class="font-semibold text-xl mb-4">Seguridad</div>
                <p class="text-surface-600 dark:text-surface-400 mb-6">Gestiona la seguridad de tu cuenta.</p>
                
                <div class="flex flex-col gap-4">
                    <Button label="Cambiar Contraseña" icon="pi pi-lock" severity="help" outlined />
                    <Button label="Activar Autenticación de Dos Factores" icon="pi pi-shield" severity="help" outlined />
                </div>
            </div>
        </div>
    </div>
</template>
