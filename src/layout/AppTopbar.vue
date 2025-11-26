<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import AppConfigurator from './AppConfigurator.vue';

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
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
        console.error('Error during logout:', error);
        // Incluso si hay error, redirigir al login
        router.push('/auth/login');
    }
};
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <!-- <img src="/images/logo.webp" alt="Logo" width="54" height="40" /> -->
                <span>DAYVO</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
            </div>

            <!-- Información del usuario (solo visible si está autenticado) -->
            <div v-if="authStore.isAuthenticated" class="flex items-center">
                <div class="mr-4 text-surface-900 dark:text-surface-0 font-medium">
                    {{ authStore.userName || authStore.userEmail.split('@')[0] || 'Usuario' }}
                </div>
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button"
                        class="layout-topbar-action p-3 text-color"
                    >
                        <i class="pi pi-user text-xl"></i>
                    </button>

                    <!-- Dropdown de usuario -->
                    <div class="hidden absolute right-0 top-full mt-2 bg-surface-0 dark:bg-surface-900 shadow-lg rounded-lg border border-surface-200 dark:border-surface-700 min-w-[200px] z-50">
                        <div class="p-4 border-b border-surface-200 dark:border-surface-700">
                            <div class="font-medium text-surface-900 dark:text-surface-0">{{ authStore.userName || authStore.userEmail.split('@')[0] }}</div>
                            <div class="text-sm text-muted-color mt-1">{{ authStore.userEmail }}</div>
                        </div>
                        <div class="p-2">
                            <router-link to="/pages/user/profile" class="w-full block text-left p-3 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-md text-surface-700 dark:text-surface-200 transition-colors">
                                <i class="pi pi-user mr-3"></i>
                                <span>Ver Perfil</span>
                            </router-link>
                            <button
                                type="button"
                                class="w-full text-left p-3 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-md flex items-center text-surface-700 dark:text-surface-200 transition-colors mt-2"
                                @click="handleLogout"
                            >
                                <i class="pi pi-sign-out mr-3"></i>
                                <span>Cerrar sesión</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Botón para mobile menu (solo si está autenticado) -->
            <button
                v-if="authStore.isAuthenticated"
                class="layout-topbar-menu-button layout-topbar-action lg:hidden"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <!-- Menú mobile (solo si está autenticado) -->
            <div v-if="authStore.isAuthenticated" class="layout-topbar-menu hidden lg:hidden">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" @click="handleLogout">
                        <i class="pi pi-sign-out"></i>
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
