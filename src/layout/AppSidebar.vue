<script setup>
import AppMenu from './AppMenu.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useLayout } from '@/layout/composables/layout';
import { computed, ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const { layoutState, toggleDarkMode, isDarkTheme } = useLayout();

const showUserMenu = ref(false);

// Computed para saber si el sidebar está colapsado
const isCollapsed = computed(() => layoutState.staticMenuDesktopInactive);

// Toggle sidebar
const toggleSidebar = () => {
    layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
};

const userInitials = computed(() => {
    const name = authStore.userName;
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
});

const userName = computed(() => authStore.userName || authStore.userEmail?.split('@')[0] || 'Usuario');
const userEmail = computed(() => authStore.userEmail || '');
const userId = computed(() => authStore.user?.id || '');

const goToProfile = () => {
    showUserMenu.value = false;
    router.push('/pages/user/profile');
};

const handleLogout = async () => {
    showUserMenu.value = false;
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
        router.push('/auth/login');
    }
};
</script>

<template>
    <div class="layout-sidebar" :class="{ 'collapsed': isCollapsed }">
        <!-- Header con Logo y botón colapsar -->
        <div class="sidebar-header">
            <router-link to="/" class="sidebar-logo">
                <span class="logo-icon">D</span>
                <span v-show="!isCollapsed" class="logo-text">DAYVO</span>
            </router-link>
            <button class="collapse-btn" @click="toggleSidebar" :title="isCollapsed ? 'Expandir menú' : 'Colapsar menú'">
                <i :class="isCollapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"></i>
            </button>
        </div>

        <!-- Contenido del menú -->
        <div class="sidebar-content">
            <app-menu :collapsed="isCollapsed"></app-menu>
        </div>

        <!-- Footer con opciones y usuario -->
        <div class="sidebar-footer">
            <div class="footer-menu">
                <router-link to="/pages/empty" class="footer-menu-item" title="Ajustes">
                    <i class="pi pi-cog"></i>
                    <span v-show="!isCollapsed">Ajustes</span>
                </router-link>
                <a href="#" class="footer-menu-item" title="Ayuda">
                    <i class="pi pi-question-circle"></i>
                    <span v-show="!isCollapsed">Ayuda</span>
                    <i v-show="!isCollapsed" class="pi pi-chevron-right chevron"></i>
                </a>
                <a href="#" class="footer-menu-item" title="Compartir comentarios">
                    <i class="pi pi-heart"></i>
                    <span v-show="!isCollapsed">Compartir comentarios</span>
                </a>
                <router-link to="/" class="footer-menu-item" title="Centro de notificaciones">
                    <i class="pi pi-bell"></i>
                    <span v-show="!isCollapsed">Centro de notificaciones</span>
                    <span class="notification-badge">2</span>
                </router-link>
            </div>
            
            <!-- Usuario con menú hover -->
            <div 
                class="user-profile-container"
                @mouseenter="showUserMenu = true"
                @mouseleave="showUserMenu = false"
            >
                <div class="user-profile">
                    <div class="user-avatar">
                        {{ userInitials }}
                    </div>
                    <div v-show="!isCollapsed" class="user-info">
                        <span class="user-name">{{ userName }}</span>
                        <span class="user-email">{{ userEmail }}</span>
                    </div>
                </div>
                
                <!-- Menú popup del usuario -->
                <Transition name="user-menu">
                    <div v-if="showUserMenu" class="user-menu-popup">
                        <div class="user-menu-header">
                            <div class="user-menu-name">{{ userName }}</div>
                            <div class="user-menu-id">
                                ID de Usuario: {{ userId }}
                                <button class="copy-btn" @click.stop>
                                    <i class="pi pi-copy"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="user-menu-section">
                            <a href="#" class="user-menu-item" @click.prevent="goToProfile">
                                <i class="pi pi-cog"></i>
                                <span>Configuración del perfil</span>
                                <i class="pi pi-chevron-right"></i>
                            </a>
                            <a href="#" class="user-menu-item" @click.prevent="toggleDarkMode">
                                <i class="pi pi-palette"></i>
                                <span>Tema</span>
                                <i class="pi pi-chevron-right"></i>
                            </a>
                            <a href="#" class="user-menu-item">
                                <i class="pi pi-bars"></i>
                                <span>Menú izquierdo</span>
                                <i class="pi pi-chevron-right"></i>
                            </a>
                            <a href="#" class="user-menu-item logout" @click.prevent="handleLogout">
                                <i class="pi pi-sign-out"></i>
                                <span>Cerrar sesión</span>
                            </a>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
// Header del sidebar
.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4rem;
    padding: 0 1rem;
    border-bottom: 1px solid var(--surface-border);

    .sidebar-logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        color: var(--text-color);
        font-weight: 700;
        font-size: 1.25rem;

        .logo-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1rem;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .logo-text {
            transition: opacity 0.2s;
        }
    }

    .collapse-btn {
        width: 28px;
        height: 28px;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-color-secondary);
        transition: all 0.2s;

        &:hover {
            background: var(--surface-hover);
            color: var(--text-color);
        }
    }
}

.sidebar-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0.5rem 0;
    
    &::-webkit-scrollbar {
        width: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: var(--surface-300);
        border-radius: 4px;
    }
}

.sidebar-footer {
    margin-top: auto;
    border-top: 1px solid var(--surface-border);
    padding: 0.75rem 0;

    .footer-menu {
        .footer-menu-item {
            display: flex;
            align-items: center;
            padding: 0.6rem 1rem;
            color: var(--text-color);
            text-decoration: none;
            font-size: 0.875rem;
            transition: background-color 0.2s;
            gap: 0.75rem;

            i {
                font-size: 1rem;
                color: var(--text-color-secondary);
                min-width: 20px;
                text-align: center;
                
                &.chevron {
                    margin-left: auto;
                    font-size: 0.7rem;
                }
            }

            .notification-badge {
                margin-left: auto;
                background: var(--primary-color);
                color: white;
                font-size: 0.65rem;
                font-weight: 600;
                padding: 0.1rem 0.35rem;
                border-radius: 10px;
                min-width: 16px;
                text-align: center;
            }

            &:hover {
                background: var(--surface-hover);
            }
        }
    }

    .user-profile-container {
        position: relative;
    }

    .user-profile {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.6rem 1rem;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
            background: var(--surface-hover);
        }

        .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(135deg, #f97316, #ea580c);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.8rem;
            flex-shrink: 0;
        }

        .user-info {
            display: flex;
            flex-direction: column;
            min-width: 0;

            .user-name {
                font-weight: 600;
                font-size: 0.85rem;
                color: var(--text-color);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .user-email {
                font-size: 0.7rem;
                color: var(--text-color-secondary);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    // Menú popup del usuario
    .user-menu-popup {
        position: fixed;
        bottom: 10px;
        left: 270px;
        width: 280px;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        z-index: 1100;
        
        // Puente invisible para mantener hover
        &::before {
            content: '';
            position: absolute;
            left: -20px;
            top: 0;
            bottom: 0;
            width: 25px;
            background: transparent;
        }

        .user-menu-header {
            padding: 1rem;
            border-bottom: 1px solid var(--surface-border);

            .user-menu-name {
                font-weight: 600;
                font-size: 1rem;
                color: var(--text-color);
                margin-bottom: 0.25rem;
            }

            .user-menu-id {
                font-size: 0.75rem;
                color: var(--text-color-secondary);
                display: flex;
                align-items: center;
                gap: 0.5rem;

                .copy-btn {
                    background: none;
                    border: none;
                    padding: 0.2rem;
                    cursor: pointer;
                    color: var(--text-color-secondary);
                    
                    &:hover {
                        color: var(--primary-color);
                    }
                }
            }
        }

        .user-menu-section {
            padding: 0.5rem;

            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 0.75rem;
                color: var(--text-color);
                text-decoration: none;
                border-radius: 8px;
                font-size: 0.875rem;
                transition: background-color 0.2s;
                gap: 0.75rem;

                i {
                    font-size: 0.9rem;
                    color: var(--text-color-secondary);
                    
                    &:last-child {
                        margin-left: auto;
                        font-size: 0.7rem;
                    }
                }

                span {
                    flex: 1;
                }

                &:hover {
                    background: var(--surface-hover);
                }

                &.logout {
                    color: #ef4444;
                    
                    i {
                        color: #ef4444;
                    }
                }
            }
        }
    }
}

// Estilos para el modo colapsado
.collapsed {
    .sidebar-header {
        justify-content: center;
        padding: 1rem 0.5rem;

        .sidebar-logo {
            .logo-text {
                display: none;
            }
        }

        .collapse-btn {
            position: absolute;
            right: -14px;
            background: var(--surface-card);
            border: 1px solid var(--surface-border);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
    }

    .sidebar-footer {
        .footer-menu-item {
            justify-content: center;
            padding: 0.6rem 0.5rem;
            
            span {
                display: none;
            }
            
            .chevron {
                display: none;
            }
            
            .notification-badge {
                position: absolute;
                top: 2px;
                right: 8px;
                margin-left: 0;
            }
        }

        .user-profile {
            justify-content: center;
            padding: 0.6rem 0.5rem;
        }

        .user-menu-popup {
            left: 70px;
        }
    }
}

// Animación del menú de usuario
.user-menu-enter-active,
.user-menu-leave-active {
    transition: all 0.2s ease;
}

.user-menu-enter-from,
.user-menu-leave-to {
    opacity: 0;
    transform: translateX(-10px);
}
</style>
